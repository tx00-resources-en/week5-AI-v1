import React, { useState } from "react";
import "./FitnessForm.css"; // Import the CSS file

const FitnessForm = () => {
  const [formData, setFormData] = useState({
    fitnessType: "",
    frequency: "",
    experience: "",
    goal: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to generate fitness plan");
      }

      const data = await res.json();
      setResponse(data.fitness_plan); // Assuming data.fitness_plan contains the entire fitness plan JSON
    } catch (error) {
      setResponse("Error generating fitness plan.");
    } finally {
      setLoading(false);
    }
  };

  const renderWorkoutDays = (workoutSplit) => {
    return workoutSplit.map((day, index) => (
      <div key={index} className="workout-day">
        <h4>{day.day} - {day.focus}</h4>
        <ul>
          {day.exercises.map((exercise, idx) => (
            <li key={idx}>
              <strong>{exercise.name}</strong>: {exercise.sets} sets of {exercise.reps}
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  const renderDietRecommendations = (dietRecommendations) => (
    <div className="diet-recommendations">
      <h4>Diet Recommendations</h4>
      <p>Caloric Intake: {dietRecommendations.caloric_intake}</p>
      <p>Macronutrient Breakdown:</p>
      <ul>
        <li>Protein: {dietRecommendations.macronutrient_breakdown.protein}</li>
        <li>Carbs: {dietRecommendations.macronutrient_breakdown.carbs}</li>
        <li>Fats: {dietRecommendations.macronutrient_breakdown.fats}</li>
      </ul>
      <p>Meal Timing: {dietRecommendations.meal_timing}</p>
      <h5>Example Meals</h5>
      {dietRecommendations.example_meals.map((meal, idx) => (
        <div key={idx}>
          <h6>{meal.meal}</h6>
          <ul>
            {meal.foods.map((food, i) => (
              <li key={i}>{food}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderRecoveryTips = (recoveryTips) => (
    <div className="recovery-tips">
      <h4>Recovery Tips</h4>
      <ul>
        {recoveryTips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
    </div>
  );

  const renderWarnings = (warnings) => (
    <div className="warnings">
      <h4>Warnings</h4>
      <ul>
        {warnings.map((warning, idx) => (
          <li key={idx}>{warning}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="form-container">
      <h2>Generate Your Fitness Plan</h2>
      <form onSubmit={handleSubmit} className="fitness-form">
        <label>Fitness Type:</label>
        <input
          type="text"
          name="fitnessType"
          value={formData.fitnessType}
          onChange={handleChange}
          required
        />

        <label>Training Frequency (per week):</label>
        <input
          type="number"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          required
        />

        <label>Experience Level:</label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label>Fitness Goal:</label>
        <input
          type="text"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Generating..." : "Get Plan"}
        </button>
      </form>

      {response && (
        <div className="response-container">
          <h3>AI-Generated Fitness Plan</h3>

          <p><strong>Experience Level:</strong> {response.experience_level}</p>
          <p><strong>Goal:</strong> {response.goal}</p>
          <p><strong>Training Frequency:</strong> {response.training_frequency} times per week</p>

          {renderWorkoutDays(response.workout_split)}

          {renderDietRecommendations(response.diet_recommendations)}

          {renderRecoveryTips(response.recovery_tips)}

          {renderWarnings(response.warnings)}
        </div>
      )}
    </div>
  );
};

export default FitnessForm;
