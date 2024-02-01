const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Note = require('../models/note');

const initNotes = [
    { content: 'Html is easy', important: false },
    { content: 'Browser can execute only Javascript', important: true },
];

beforeEach(async () => {
    await Note.deleteMany({});
    let noteObject = new Note(initNotes[0]);
    await noteObject.save();
    noteObject = new Note(initNotes[1]);
    await noteObject.save();
}, 100000);

test('notes are returned as json', async () => {
    await api.get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000);

test('there are two notes', async () => {
    const res = await api.get('/api/notes');
    expect(res.body).toHaveLength(initNotes.length);
}, 100000);

test('the first is Html is easy', async () => {
    const res = await api.get('/api/notes');
    const contents = res.body.map(r => r.content);
    expect(contents).toContain('Html is easy');
}, 100000);

afterAll(async () => {
    await mongoose.connection.close();
});