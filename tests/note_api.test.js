const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Note = require('../models/note');
const url = '/blog/notes';

beforeEach(async () => {
    await Note.deleteMany({});
    let noteObject = helper.initNotes.map(note => new Note(note));
    const promiseArray = noteObject.map(note => note.save());
    await Promise.all(promiseArray);
}, 100000);

test('notes are returned as json', async () => {
    await api.get(url)
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000);

test('there are two notes', async () => {
    const res = await api.get(url);
    expect(res.body).toHaveLength(helper.initNotes.length);
}, 100000);

test('the first is Html is easy', async () => {
    const res = await api.get(url);
    const contents = res.body.map(r => r.content);
    expect(contents).toContain('Html is easy');
}, 100000);

test('a valid note can be added', async () => {
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true
    };
    await api
        .post(url)
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    const res = await helper.notesInDb();
    const contents = res.map(r => r.content);
    expect(res).toHaveLength(helper.initNotes.length + 1);
    expect(contents).toContain('async/await simplifies making async calls');
})

test('note without content is not added', async () => {
    const newNote = {
        important: true
    };
    await api
        .post(url)
        .send(newNote)
        .expect(400);
    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initNotes.length)
});

test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToView = notesAtStart[0];
    const res = await api
        .get(`${url}/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual(noteToView)
});

test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];
    await api
        .delete(`${url}/${noteToDelete.id}`)
        .expect(204);
    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initNotes.length - 1);
    const contents = notesAtEnd.map(r => r.content);
    expect(contents).not.toContain(noteToDelete.content);
});

afterAll(async () => {
    await mongoose.connection.close();
});