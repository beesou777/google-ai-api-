const express = require('express');
const { generateContent } = require('../controllers/chatController');

const router = express.Router();

router.post('/generate-content', generateContent);

module.exports = router;
