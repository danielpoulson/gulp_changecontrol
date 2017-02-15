// @flow
import express from 'express';
import './config/auth';
import mongoose from './config/mongoose';
import expressfile from './config/express';

process.env.NODE_ENV = 'development';
process.env.PORT = 7005;    
const app = express();

const config = {
  db: 'mongodb://localhost/techservices',
  env: process.env.NODE_ENV
};

expressfile(app, config);
mongoose(config);
require('./config/passport')();
app.use(require('./config/route'));

app.get('*', function (req, res) {
    res.render('index.html');
});

/*eslint no-console: 0*/
app.listen(process.env.PORT, function() {
    console.log('Express server 🌎  listening on port : ' + process.env.PORT);
    console.log('env = ' + process.env.NODE_ENV +
                '\nprocess.cwd = ' + process.cwd());
});