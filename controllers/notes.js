const notesRouter = require('express').Router()
const Note = require('../models/note')


// fetching all notes
notesRouter.get('/', (req, res, next) => {
    Note.find({})
        .then((result) => {
            res.json(result);
        })
        .catch((error) => next(error));
});

// fetching single notes
notesRouter.get('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    Note.findById(id)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            next(error);
        });
});

// delete a note
notesRouter.delete('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    Note.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch((error) => next(error));
});

// post new note
notesRouter.post('/', (req, res, next) => {
    const { content, important } = req.body;
    const newNote = new Note({
        content,
        important: important || false,
    });
    newNote.save()
        .then((savedNote) => {
            res.json(savedNote);
        })
        .catch((error) => next(error));
});

// update a note with the put function handler
notesRouter.put('/:id', (req, res, next) => {
    const id = Number(req.params.id);
    let note = Note.find(id);
    note = { ...note, important: !note.important };
    Note.findByIdAndUpdate(id, note, { new: true })
        .then((updatedNote) => {
            res.json(updatedNote);
        })
        .catch((error) => next(error));
});

module.exports = notesRouter;