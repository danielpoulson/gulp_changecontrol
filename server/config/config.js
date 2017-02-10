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
    },
    mailgun: {
          api_key: 'key-d4288ca098eebff7793dfbe2aa943a7f',
          domain: 'sandbox5c555bb04a2c41e6b4b4e733d1d0fe50.mailgun.org'
    }

};
