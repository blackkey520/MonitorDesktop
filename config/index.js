
import path from 'path';

const config = {
    server: {
        port: process.env.PORT || 3000,
        host: 'localhost'
    },

    client: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../src/assets'),
    db: path.resolve(__dirname, '../src/db'),
    dist: path.resolve(__dirname, '../dist'),
};

export default config;
