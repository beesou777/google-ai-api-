const showdown = require('showdown');
const generativeAIService = require('../services/generativeAIService');
const { createContext } = require('../utils/createContext');

const converter = new showdown.Converter();

let chatHistory = [];

const generateContent = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const context = createContext(chatHistory);

    try {
        const newPrompt = `${context}\nUser: ${prompt}\nAssistant:`;

        const result = await generativeAIService.generateContent(newPrompt);

        if (result && result.response.text()) {
            let markdownContent = result.response.text();
            const html = converter.makeHtml(markdownContent);
            chatHistory.push({ prompt, response: html });
            res.json({ html, chatHistory });
        } else {
            res.status(500).json({ error: 'Unexpected result structure' });
        }

    } catch (error) {
        let errorMessage = 'Error generating content';
        if (error.message.includes('SAFETY')) {
            errorMessage = 'The prompt might have violated safety guidelines. Please try rephrasing it.';
        }
        res.status(500).json({ error: errorMessage, details: error.message });
    }
};

module.exports = {
    generateContent
};
