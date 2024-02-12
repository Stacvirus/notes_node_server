const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res, next) => {
    const { username, name, password } = req.body;

    if (password.length < 3 || username.length < 3) {
        return res.status(400).send({ error: 'username or password length insufficient' });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, name, passwordHash });
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        next(error);
    }
});

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await User.find({}).populate('notes', { content: 1, important: 1 });
        res.json(users);
    } catch (error) {
        next(error);
    }
});

module.exports = usersRouter;