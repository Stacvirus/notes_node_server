const User = require('../models/user');

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(s => s.toJSON());
}

module.exports = usersInDb;