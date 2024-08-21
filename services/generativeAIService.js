const { GoogleGenerativeAI } = require('@google/generative-ai');
const { API_KEY } = require('../config/config');

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safety: { 
    "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE", 
    "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE", 
    "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE", 
    "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE" 
} });

const generateContent = async (prompt) => {
    return await model.generateContent([prompt]);
};

module.exports = {
    generateContent
};
