// @flow
import express from 'express';
// const auth = require('./server/config/auth');
import './config/auth';

process.env.NODE_ENV = 'development';
process.env.PORT = 7005;

const app = express();

const config = {
  db: 'mongodb://localhost/techservices',
  env: process.env.NODE_ENV
};

// require('./server/config/express')(app, config);
// require('./server/config/mongoose')(config);
// require('./server/config/passport')();
// app.use(require('./server/config/route'));

require('./config/express')(app, config);
require('./config/mongoose')(config);
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