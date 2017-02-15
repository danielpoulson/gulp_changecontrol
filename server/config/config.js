const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://localhost/techservices',
        rootPath: rootPath,
        staticFiles:   rootPath,
        appViews: rootPath + '/views/',
        webpackConfig: rootPath + 'webpack/common.config',
        port: process.env.PORT || 9005
    },
    production: {
        db: 'mongodb://au01a112/techservices',
        rootPath: rootPath,
        staticFiles: rootPath,
        appViews: rootPath + '/views/',
        port: process.env.PORT || 9005
    }

};
