import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.css"; 

function App() {
  const [inputValue, setInputValue] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_REACT_APP_GEMINI_API_KEY);
  const MODEL_NAME = "gemini-1.5-flash"; 
  // - gemini-2.0-flash
  // - gemini-2.0-flash-lite-preview-02-05
  // - gemini-1.5-flash
  // - gemini-1.5-pro

  
  // Handle input change
  const handleInputChange = (e) => setInputValue(e.target.value);

  // Get response from the API
  const getResponse = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      
      const result = await model.generateContent(inputValue);
      const text = result.response.text();

      setInputValue(""); // Clear the input field
      setResponses((prevResponses) => [...prevResponses, text]); // Update responses array
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="chat-box">
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask me something..."
            className="input-field"
          />
          <button onClick={getResponse} className="send-btn">
            Send
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="responses-container">
            {responses.map((response, index) => (
              <div key={index} className={`response-text ${index === responses.length - 1 ? "fw-bold" : ""}`}>
                {response}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
