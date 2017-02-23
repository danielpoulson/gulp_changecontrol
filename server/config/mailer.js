"use strict";
/*eslint no-console: 0*/
import nodemailer from 'nodemailer';
import xoauth2 from 'xoauth2';
import config from './config';
import path from 'path';
import fs from 'fs';
const rootPath = path.normalize(__dirname);


exports.sendMail = function(toEmail, emailType, emailActivity) {
  const emailSubject = "You have been assigned ownership of a " + emailType;

 let _auth = {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: config.auth.user,
            clientId: config.auth.clientId,
            clientSecret: config.auth.clientSecret,
            refreshToken: config.auth.refreshToken,
            accessToken: config.auth.accessToken
        })
    };

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: _auth
  });

  fs.readFile(rootPath + '/mail.html', 'utf8', function(err, html){
      if (err) {
        console.log('Error Reading html file: ' + err);
      }
    
    const _html = '<html><body STYLE="font-size: 12pt/14pt; font-family:sans-serif"><h3>You have been assigned ownership of this '
    + emailType + '</h3></br>' + emailActivity + '</br>' + html + '</body></html>';

    transporter.sendMail({
        from: config.auth.user,
        to: toEmail, // An array if you have multiple recipients.
        subject: emailSubject,
        html: _html
      },
      function (err, info) {
      if (err) {
        console.log('Error sending mail: ' + err);
      }

      transporter.close();
    });
  });


};
