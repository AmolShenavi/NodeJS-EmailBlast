/**************************************
 * 
 *   creates >  Transporer object 
 *   for     > sending mails in bulk
 * 
***************************************/

var nodemailer = require('nodemailer');
const config = require('./config');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port  : config.smtp_port  ,
    auth: {
      user: config.myemail,
      pass: config.mypassword
    },
    tls: {   // for localhost server
      rejectUnauthorized: false
    }
  });

  module.exports = transporter;