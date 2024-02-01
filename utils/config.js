require('dotenv').config('./.gitignore');

const PORT = process.env.PORT,
    MONGODB_URI = process.env.MONGODB_URI

module.exports = { PORT, MONGODB_URI };
