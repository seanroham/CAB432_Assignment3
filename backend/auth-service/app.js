require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
app.use(bodyParser.json());





app.use('/', authRouter); // Routes for user authentication

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
});

module.exports = app;
