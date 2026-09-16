const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
    HOST_BE: process.env.HOST_BE || '127.0.0.1',
    PORT_BE: process.env.PORT_BE || 3000,

    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'scaffold'
    },
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret' ,
};

module.exports = config;
