//'use strict';
//const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const nodemailer = require('nodemailer');
const config = require('./config');
const path = require('path');
const transporter = require('./NodeMailobj');
const verify = require('./verify');
const logger =require('./LoggerConfig');
const EventEmitter = require('events');
//Create an EventEmitter object
const myEmitter = new EventEmitter();


//lets bind the eventhandler to  

myEmitter.on('Monitor', Check_Empty);
myEmitter.on('EmailBlast', Blast);
myEmitter.on('Interval', Interval);

//-------------------------------------------------------------------end 1    
// check directory for files added 
function Check_Empty() {
    
        fs.readdir(config.Outbox_path, (err, files) => {
            if (err) {
                console.log(err);
                logger.error(err.message);
            }
            else{
                if(files.length == 0)
                {
                    console.log('Outbox Folder is empty');
                    myEmitter.emit('Interval');
                }
                else{
                      console.log('Outbox has ' + files.length + ' files.  And files are = ' + files);
                         // display all files names 
                     logger.info(files.length + ' Files Reads');
                     //console.log(y);
                     myEmitter.emit('EmailBlast');
                }            
            } // end of else
        })
}

//-------------------------------------------------------------------end 2    

// Blast mails 
async function Blast() {
    fs.readdir(config.Outbox_path, (err, files) => {
      if (err) 
      {
        console.log(err);
        logger.error(err.message);
      }
      let y = (files.length == 0) ? "Outbox Folder is empty" : "Outbox has " + files.length + " files.";
      // display all files names in array
      console.log(files);
      logger.info(files.length + ' Files Reads')
      console.log(y);

      // read files 
      //  lets get single-single file 
      for (let file of files) 
      {
        fs.readFile(config.Outbox_path + '/' + file, 'utf8', (err, data) => {
        if (err) 
        {
          console.log(err);
          logger.error(err.message);
        }
        else 
        {
          console.log('--> Checking For ' + file);
          try 
          {
            var words = JSON.parse(data);
            if (words.to && words.cc && words.subject && words.body) 
            {
              console.log(' All content of JSON file is OK..');
              const emailStatus = verify.validateEmail(words.to);
              console.log(' Email Address :> ' + words.to);
              //console.log('mail will be sent successfully..........')
              if (emailStatus)  // if(true)-- email is valid
              {
                Sendmail(words.to, words.cc, words.subject, words.body, file);
                // send mail
              }
            }
            else 
            {
              console.log('check JSON content required(to, cc, subject,body) & try again ..');
              logger.error(' JSON file is not valid..');
              return false;
            }
          }
          catch (e) 
          {
            console.log('check JSON content');
            logger.error(' JSON file is not valid..');
            return false;
          }
        }
       }); // end of Readfile
      } // end  of for --- all files form directory 
   // myEmitter.emit('Interval');
    }); // end of checking outbox directory
   
}

//----------------------------------------------------------------------------end 3   

//  lets send the mail
async function Sendmail(M_to, M_cc, M_sub, M_body, MailFile) {
    let HelperOptions = {
        from    : config.myemail,
        to      : M_to,
        cc      : M_cc,
        subject : M_sub,
        text    : M_body
    };

    transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
            if (error.code == 'EDNS') {
                console.log('Error while SMTP connection');
                logger.error('Error while SMTP connecting');
                console.log("The message was not sent to " + M_to + " !");
                MoveToDraft(MailFile);
                //  return false;
            }
            console.log(error.code);
             MoveToDraft(MailFile);
            logger.error(error);
            //return false;
        }
        else {
            console.log("The message was sent to " + M_to + " !");
            console.log(info);
            logger.info('Mail sent successfully to ' + M_to + ' !');
             MoveToInbox(MailFile);
            //  return true;
        }
    });
} // end Sendmail()
//------------------------------------------------------------------------end 4   

// lets move unsent mail file to draft folder
function MoveToDraft(fileNameA) {
    // move file from one folder to another folder with rename function
    fs.rename(config.Outbox_path + '/' + fileNameA, config.Draft_path + '/d_' + fileNameA, (err) => {
        if (err) {
            console.log(err);
            //      return false;
        }
        console.log('d_' + fileNameA + ' File Save as Draft!');
        //   return true;
    }); // end MoveToDraft
}
//-------------------------------------------------------------------------end 5


function MoveToInbox(fileNameB) {
    // move file from one folder to another folder with rename function 
    fs.rename(config.Outbox_path + '/' + fileNameB, config.Inbox_path + '/s_' + fileNameB, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('s_' + fileNameB + ' File was inserted to Inbox !');
        //  return true;
    }); // end MoveToInbox
}

//---------------------------------------------------------------------------end 6

function main() {
    Blast(); // gets files from Outbox folder, verifies the JSON files and send mails 
    console.log('Main - Blast Completed...');

}

//-------------------------------------------------------------------------------end 7

function MyApp() {  
    main(); 
    console.log(' One Cycle completed... :-)');
}

//-------------------------------------------------------------------------------end 8
   MyApp();
//-------------------------------------------------------------------------- Interval

 function Interval(){
    setTimeout(()=>{
        console.log(' <<<<<<<<<Interval>>>>>>>>> ');
        myEmitter.emit('Monitor');
    }
    , 10000);
}


//--------------------------------------------------------------------------- Emitter

setImmediate(()=>{
   myEmitter.emit('Interval');
});
