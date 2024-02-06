const dcrypt = require('bcrypt');
const User = require('../models/user');
const mongoose = require('mongoose');
const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);
const url = '/blog/users';
const usersInDb = require('./users_helper');

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        const passwordHash = await dcrypt.hash('password', 10);
        const user = new User({
            username: 'root', name: 'superuser', passwordHash
        });
        await user.save();
    })

    test('creation succeeds with a fresh username', async () => {
        const start = await usersInDb();
        const newUser = {
            username: 'stacvirus',
            name: 'satcha takam',
            password: 'kfokam48@23'
        }
        await api.post(url).send(newUser).expect(201)
            .expect('Content-type', /application\/json/);
        const end = await usersInDb();
        expect(end).toHaveLength(start.length + 1);
        const usernames = end.map(n => n.username);
        expect(usernames).toContain(newUser.username);
    });

    test('creation failed with proper status code message if username already taken', async () => {
        const start = await usersInDb();
        const newUser = {
            username: 'root',
            name: 'superuser',
            password: 'isityou552'
        };
        const res = await api
            .post(url)
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        console.log(res.body)
        expect(res.body).toContain('expected `username` to be unique');
        const end = await usersInDb();
        expect(end).toEqual(start);
    }, 10000);
});

afterAll(async () => {
    await mongoose.connection.close();
});