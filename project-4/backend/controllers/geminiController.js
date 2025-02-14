const model = require("../models/geminiModel");

// Function to generate fitness guidelines
const generateFitnessPlan = async (
  fitnessType,
  frequency,
  experience,
  goal
) => {
  const prompt1 = `
    I am a ${experience} individual looking to focus on ${fitnessType}.
    My goal is to ${goal}, and I plan to train ${frequency} times per week.
    Provide a structured fitness guideline including recommended exercises, duration, and any diet suggestions.
  `;

  const prompt2 = `
  You are a professional fitness coach. Given the user's fitness experience, training frequency, and goal, generate a **structured fitness plan** in **JSON format**.
  
  ### **Schema Requirements**:
  The JSON response should have the following structure:
  
  {
    "fitness_plan": {
      "experience_level": "string",
      "goal": "string",
      "training_frequency": "number",
      "workout_split": [
        {
          "day": "string",
          "focus": "string",
          "exercises": [
            {
              "name": "string",
              "sets": "number",
              "reps": "string"
            }
          ]
        }
      ],
      "diet_recommendations": {
        "caloric_intake": "string",
        "macronutrient_breakdown": {
          "protein": "string",
          "carbs": "string",
          "fats": "string"
        },
        "meal_timing": "string",
        "example_meals": [
          {
            "meal": "string",
            "foods": ["string"]
          }
        ]
      },
      "recovery_tips": ["string"],
      "warnings": ["string"]
    }
  }
  
  ### **User Input**:
  I am a **${experience}** individual looking to focus on **${fitnessType}**.
  My goal is to **${goal}**, and I plan to train **${frequency}** times per week.
  
  Provide a structured fitness guideline including:
  - **Recommended exercises** with sets and reps.
  - **Workout split** (daily training focus).
  - **Dietary recommendations** (caloric intake, macronutrient breakdown, example meals).
  - **Recovery tips** and **warnings** to avoid injury.
  - **Return the response in the above JSON format**.
  `;

  try {
    const result = await model.generateContent(prompt2);

    // The ?. (optional chaining) operator allows you to safely access properties that might not exist. If result is null or undefined, the entire expression will return undefined, instead of throwing an error.
    if (!result?.response?.candidates?.length) {
      return false; // Return early if the response structure is not as expected
    }
    // Extract the relevant text from the response
    const generatedText = result.response.candidates[0].content.parts[0].text;
    return generatedText;
  } catch (error) {
    console.error("LLM Error:", error);
    throw new Error(`Failed to generate fitness plan: ${error.message}`);
  }
};

const generateResponse = async (req, res) => {
  try {
    const { fitnessType, frequency, experience, goal } = req.body;

    if (!fitnessType || !frequency || !experience || !goal) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const markdownResponse = await generateFitnessPlan(
      fitnessType,
      frequency,
      experience,
      goal
    );

    const jsonMatch = markdownResponse.match(/```json\s*([\s\S]*?)\s*```/);

    if (!jsonMatch) {
      return res
        .status(500)
        .json({ error: "Invalid response format. No JSON found." });
    }

    let fitnessPlan;
    try {
      fitnessPlan = JSON.parse(jsonMatch[1]);

      // Flatten the plan key
      if (fitnessPlan.plan && fitnessPlan.plan.fitness_plan) {
        fitnessPlan = fitnessPlan.plan.fitness_plan;
      }

      // Standardize caloric intake format
      if (fitnessPlan.diet_recommendations?.caloric_intake) {
        const intakeRange =
          fitnessPlan.diet_recommendations.caloric_intake.match(/\d+/g);
        fitnessPlan.diet_recommendations.caloric_intake = {
          range: intakeRange ? intakeRange.join("-") : "Unknown",
          unit: "calories",
          notes: "Adjust based on individual needs and metabolism",
        };
      }

      // Ensure reps use numeric min-max values
      fitnessPlan.workout_split?.forEach((day) => {
        day.exercises.forEach((exercise) => {
          if (
            typeof exercise.reps === "string" &&
            exercise.reps.includes("-")
          ) {
            const [min, max] = exercise.reps.split("-").map(Number);
            exercise.reps = { min, max };
          } else if (!isNaN(exercise.reps)) {
            exercise.reps = {
              min: Number(exercise.reps),
              max: Number(exercise.reps),
            };
          }
        });
      });

      // Improve warnings format
      if (Array.isArray(fitnessPlan.warnings)) {
        fitnessPlan.warnings = fitnessPlan.warnings.map((warning) => ({
          category: warning.includes("injuries")
            ? "Injury Prevention"
            : "General",
          message: warning,
        }));
      }
    } catch (parseError) {
      return res.status(500).json({ error: "Error parsing JSON response." });
    }

    // Return formatted response
    res.json(fitnessPlan);
  } catch (err) {
    console.error("Error in generateResponse:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = generateResponse;
