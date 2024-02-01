const Note = require('../models/note');

const initNotes = [
    { content: 'Html is easy', important: false },
    { content: 'Browser can execute only Javascript', important: true },
];

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon' });
    await note.save();
    await note.deleteOne();
    return note_id.toString();
};

const notesInDb = async () => {
    const notes = await Note.find({});
    return notes.map(n => n.toJSON());
};

module.exports = {
    initNotes,
    nonExistingId,
    notesInDb
};