const config = require('./utils/config');
const { info, error } = require('./utils/logger');
const express = require('express');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
info('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        info('connected to', config.MONGODB_URI);
    })
    .catch((err) => error('error connecting to MongoDB:', err.message));

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use('/api/notes', notesRouter);

module.exports = app;