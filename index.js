const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { PORT } = require('./config/config');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes); // Prefix routes with /api

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
