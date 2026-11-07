
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./src/routes');

const app = express();

app.disable('x-powered-by');

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(x => x.trim())
        : true
}));

app.use('/api/payments/webhook', express.raw({
    type: 'application/json',
    limit: '1mb'
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
    res.json({
        ok: true,
        service: 'toya-backend'
    });
});

app.use('/api', routes);

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    const status = Number(err.statusCode || err.status) || 500;

    res.status(status).json({
        error: status >= 500
            ? 'Internal server error'
            : err.message || 'Request failed'
    });
});

module.exports = app;
