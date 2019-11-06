/**************************************
 * 
 *   creates >  Transporer object 
 *   for     > sending mails in bulk
 * 
***************************************/

var nodemailer = require('nodemailer');
const config = require('./config');

// for hotmail config
let transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: config.myemail,
    pass: config.mypassword
  },
});


// for gmail config
// let transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     secure: false,
//     port  : config.smtp_port  ,
//     auth: {
//       user: config.myemail,
//       pass: config.mypassword
//     },
//     tls: {   // for localhost server
//       rejectUnauthorized: true
//     }
//   });



  module.exports = transporter;