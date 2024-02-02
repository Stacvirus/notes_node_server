const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors')
const Note = require('./models/note');

const url = 'mongodb://127.0.0.1:27017/blog/notes';
const port = 3000;

mongoose.connect(url)
    .then(() => console.log('connected to local dataBase'))
    .catch((err) => console.log(err.message))


app.use(cors());
app.listen(port, () => {
    console.log('server running on port:', port);
});

async () => {
    const note = new Note({
        content: 'This is a fucking local mongo dataBase',
        important: true
    });
    try {
        await note.save();
    } catch (error) {
        console.log(error.message);
    }
};