const cors = require('cors');

const corsOptions = {
    origin: process.env.FRONTEND_URI,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);