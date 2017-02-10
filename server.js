const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');

process.env.NODE_ENV = 'development';
process.env.PORT = 7005;

const app = express();

const config = {
  env: process.env.NODE_ENV
};

app.set('views', './dist');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('./dist'));
app.use(require('./server/config/route'));

app.get('*', function (req, res) {
    res.render('index.html');
});

/*eslint no-console: 0*/
app.listen(process.env.PORT, function() {
    console.log('Express server 🌎  listening on port : ' + process.env.PORT);
    console.log('env = ' + process.env.NODE_ENV +
                '\nprocess.cwd = ' + process.cwd());
});