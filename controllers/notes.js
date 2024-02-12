const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { info } = require('../utils/logger');


const getTokenFrom = req => {
    const authorisation = req.get('authorization');
    if (authorisation && authorisation.startsWith('Bearer ')) {
        return authorisation.replace('Bearer ', '');
    }
    return null;
}

// fetching all notes
notesRouter.get('/', async (req, res, next) => {
    try {
        const result = await Note.find({}).populate('user', { username: 1, name: 1 });
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// fetching single notes
notesRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await Note.findById(id).populate('users', { username: 1, name: 1 });;
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// delete a note
notesRouter.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Note.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

// post new note
notesRouter.post('/', async (req, res, next) => {
    const { content, important } = req.body;
    let decodedtoken = null;
    try {
        decodedtoken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    } catch (error) {
        return next(error);
    }
    // if (!decodedtoken.id) {
    //     return res.status(401).json({ error: 'token invalid' });
    // }

    const user = await User.findById(decodedtoken.id);
    const newNote = new Note({
        content,
        important: important || false,
        user: user.id,
    });
    try {
        const result = await newNote.save();
        user.notes = user.notes.concat(result._id);
        await user.save();
        res.status(201).json(result)
    } catch (error) {
        next(error);
    }
});

// update a note with the put function handler
notesRouter.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    let note = await Note.findById(id);
    try {
        const result = await Note.findByIdAndUpdate(id, note, { new: true });
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = notesRouter;