const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Note = require('../models/note');

beforeEach(async () => {
    await Note.deleteMany({});
    let noteObject = new Note(helper.initNotes[0]);
    await noteObject.save();
    noteObject = new Note(helper.initNotes[1]);
    await noteObject.save();
}, 100000);

test('notes are returned as json', async () => {
    await api.get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000);

test('there are two notes', async () => {
    const res = await api.get('/api/notes');
    expect(res.body).toHaveLength(helper.initNotes.length);
}, 100000);

test('the first is Html is easy', async () => {
    const res = await api.get('/api/notes');
    const contents = res.body.map(r => r.content);
    expect(contents).toContain('Html is easy');
}, 100000);

test('a valid note can be added', async () => {
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true
    };
    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    const res = await helper.notesInDb();
    console.log(res)
    const contents = res.map(r => r.content);
    expect(res).toHaveLength(helper.initNotes.length + 1);
    expect(contents).toContain('async/await simplifies making async calls');
})

test('note without content is not added', async () => {
    const newNote = {
        important: true
    };
    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400);
    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initNotes.length)
});

afterAll(async () => {
    await mongoose.connection.close();
});