const config = require('./utils/config');
const { info, error } = require('./utils/logger');
const express = require('express');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');


mongoose.set('strictQuery', false);
info('connecting to', MONGODB_URI);
mongoose.connect(MONGODB_URI)
    .then(() => {
        info('connected to', MONGODB_URI);
    })
    .catch((err) => error('error connecting to MongoDB:', err.message));

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use('/blog/notes', notesRouter);
app.use('/blog/users', usersRouter);
app.use('/blog/login', loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;