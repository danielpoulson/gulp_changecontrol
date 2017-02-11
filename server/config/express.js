"use strict";
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');
let appViews = rootPath + '/';
// let appViews = rootPath + '/dist';

/*eslint no-console: 0*/

module.exports = function (app, config) {

  if (config.env === 'development') {
    // appViews = rootPath + '/dist';
    appViews = rootPath + '/';
  }
    app.set('views', appViews);
    app.engine('html', require('ejs').renderFile);
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(require('express-session')({
        secret: 'p7r6uktdhmcgvho8o6e5ysrhxmcgjfkot7r6elu5dtjt7lirfyj',
        resave: false,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.static(appViews));

};
