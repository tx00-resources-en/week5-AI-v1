import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_REACT_APP_GEMINI_API_KEY);
const MODEL_NAME = "gemini-1.5-pro"; // 
// - gemini-2.0-flash
// - gemini-2.0-flash-lite-preview-02-05
// - gemini-1.5-flash
// - gemini-1.5-pro
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export const generateContent = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        const text = await result.response.text(); 
        console.log(text);
        return text; // Return the actual text
    } catch (error) {
        console.error("Error generating content:", error);
        return "Error: Unable to generate content."; // Return a fallback response
    }
};


