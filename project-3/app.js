const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const generateResponse  = require("./controllers/geminiController");
// console.log("GEMINI API KEY:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Not Found ❌");

const app = express();

app.use(express.json());

app.post("/generate", generateResponse);

app.get("/", (req, res) => {
  res.send("API is running");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
