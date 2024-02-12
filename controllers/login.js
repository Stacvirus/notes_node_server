const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return res.status(401).json({ error: 'invalid username or password' });
    }

    const userForToken = {
        username: user.username,
        id: user._id
    };

    try {
        const token = jwt.sign(userForToken, process.env.SECRET);
        res.status(200)
            .send({ token, username: user.username, name: user.name });
    } catch (error) {
        next(error);
    }
});

module.exports = loginRouter;