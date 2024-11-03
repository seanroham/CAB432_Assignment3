require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const videoRouter = require('./routes/video');

const app = express();
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/', videoRouter); // Routes for video upload functionality

// Error handling for 404
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// General error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
});

module.exports = app;
