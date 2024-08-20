const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const cors = require('cors');
const showdown = require('showdown');

const app = express();
const port = process.env.PORT || 3000;

const converter = new showdown.Converter();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let chatHistory = [];

const contextWindow = 5;

function createContext(chatHistory) {
  const recentHistory = chatHistory.slice(-contextWindow);
  return recentHistory.map(item => `User: ${item.prompt}\nAssistant: ${item.response}`).join('\n');
}

// API endpoint to generate content
app.post('/generate-content', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const context = createContext(chatHistory);

  try {
    // Combine the context with the new prompt
    const newPrompt = `${context}\nUser: ${prompt}\nAssistant:`;

    const result = await model.generateContent([newPrompt]);

    if (result && result.response && result.response.text) {
      let markdownContent = result.response.text();
      const html = converter.makeHtml(markdownContent);

      // Update chat history with the current prompt and response
      chatHistory.push({ prompt, response: html });

      res.json({ html, chatHistory });
    } else {
      res.status(500).json({ error: 'Unexpected result structure' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Error generating content', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
