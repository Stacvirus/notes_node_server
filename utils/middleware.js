const { info } = require('./logger');

const requestLogger = (req, res, next) => {
    info('Method:', req.method);
    info('Path:', req.path);
    info('Body:', req.body);
    info('---');
    next();
}

const errorHandler = (error, req, res, next) => {
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: error.message });
    } else if (error.name === 'TokenExpirationError') {
        return res.status(401).json({ error: 'token expired' });
    }
    next(error);
};

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

module.exports = { requestLogger, errorHandler, unknownEndpoint };