// POST request to /generate with the following JSON payload:
// {
//   "prompt": "Write 3 Javascript Tips for Beginners"
// }

const model = require("../models/geminiModel");

const generateResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    console.log(result);

    // console.log("API Result:", JSON.stringify(result, null, 2)); // Log the result to verify its structure

    // Safely check for the nested response structure
    if (
      result &&
      result.response &&
      result.response.candidates &&
      result.response.candidates.length > 0
    ) {
      // Extract the relevant text from the response
      const generatedText = result.response.candidates[0].content.parts[0].text;

      // Send the extracted text back as a clean JSON response
      res.json({ response: generatedText });
    } else {
      // Handle case where the expected response structure is missing
      res
        .status(500)
        .json({
          message: "Unexpected response format from Gemini API",
          result,
        });
    }
  } catch (err) {
    console.error("Error in generateResponse:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = generateResponse;
