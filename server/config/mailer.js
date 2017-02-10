"use strict";
/*eslint no-console: 0*/
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const config = require('./config');
const path = require('path');
const rootPath = path.normalize(__dirname);
const fs = require('fs');

exports.sendMail = function(toEmail, emailType, emailActivity) {
  const emailSubject = "You have been assigned ownership of a " + emailType;
  // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)

  let auth = {
    auth: config.mailgun
  };

  const nodemailerMailgun = nodemailer.createTransport(mg(auth));

  fs.readFile(rootPath + '/mail.html', 'utf8', function(err, html){
      if (err) {
        console.log('Error: ' + err);
      }
    const _html = '<html><body STYLE="font-size: 12pt/14pt; font-family:sans-serif"><h3>You have been assigned ownership of this '
    + emailType + '</h3></br>' + emailActivity + '</br>' + html + '</body></html>';

    nodemailerMailgun.sendMail({
        from: 'changecontrol@fmc.com',
        to: toEmail, // An array if you have multiple recipients.
        subject: emailSubject,
        html: _html
      },
      function (err, info) {
      if (err) {
        console.log('Error: ' + err);
      }
    });
  });


};
