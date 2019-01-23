/*****************************  
 *  All validation is done here 
*******************************/
var  fs = require('fs');

// if the given directory is not  found then create dir
function verifyDir(logDir){
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
      }    
}

// if the given directory is not  found then create dir
function verifyFile(logfile){
    if (fs.exists(logfile)) {
          console.log(logfile+' is already exits');
          return false;
      }    
}


//  checks for email validation 
function validateEmail(emailField){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    console.log('Checking Email..') ;                   
    if (reg.test(emailField) == false) 
    {
        console.log('Email is invalid') ; 
        return false;                  
    }
            console.log('Email is valid') ;
            return true;
}


module.exports = {verifyDir, validateEmail, verifyFile};

