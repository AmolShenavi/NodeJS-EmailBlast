// Declaration of global variables and import modules
const fs = require('fs');
var nodemailer = require('nodemailer');


// read directory
function Check_empty(){
  fs.readdir('./Outbox',(err,files)=>{
    if(err) 
        console.log(err);
     else{  
	           // get files name in array
           if(files.length==0) 
           {
               console.log("Folder is empty");
           } // end if
           else   // if folder is not empty
           {  
               console.log("OutBox :> ");
               console.log(files);  // display all files names in array
               for(let file of files)  // read data from each files
               {
                   fs.readFile('./Outbox/'+file,'utf8',(err,data)=>{
                       var mailStatus="NOtS";
                        if(err){
                            console.log(err);
                        } 
                        else{
                                 // fetch data from json file
                          var words = JSON.parse(data);
                                // Assign values to specific variables
                          fileN=file;  // store file name 
                          var m_To = words.to;
                          var m_CC = words.cc;
                          var m_Subject = words.subject;
                          var m_Body = words.body;
                         //  console.log(words); // print JSON file content
						 
                          console.log(" Sending Email to "+ words.to);  
                         Sendmail(m_To, m_CC, m_Subject, m_Body);   // send mail
                           
                        } // end else --of success
                    });// end readfile
               }
            }
         } // end else of readdir()
    });
}


function MoveToInbox(){
            // move file from one folder to another folder with rename 
               // var fileN='mail1.json';
          fs.rename('./Outbox/'+fileN,'./Inbox/s_'+fileN ,  (err) =>{
                if (err) 
                       console.log(err);
                else
                       console.log('File Inserted to Inbox!');
      }); // end of rename
}  // end MoveToInbox


function MoveToDraft(){
    // move file from one folder to another folder with rename 
       // var fileN='mail1.json';
       fs.rename('./Outbox/'+fileN,'./Draft/d_'+fileN ,  (err) =>{
        if (err) 
               console.log(err);
        else
               console.log('File Save as Draft!');
       });   // end rename
}    // end MoveToDraft


      // function to send mail
function Sendmail(m_To, m_CC, m_Subject, m_Body){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,   // SMTP Port number (By default it's runs on 25 )
        auth: {
          user: 'yourEmail@gmail.com',
          pass: 'your_password'
        },
        tls: {   // for localhost server
          rejectUnauthorized: false
        }
      });
      
      let HelperOptions = {
        from: '"Amol" <yourEmail@gmail.com',
        to: m_To,
        cc: m_CC,
        subject: m_Subject,
        text: m_Body
      };
           
      transporter.sendMail(HelperOptions, (error, info) => {
          if (error) 
          {
            console.log(error);
            MoveToDraft();
          }
          else
          {
            console.log("The message was sent to "+ m_To + " !");
            console.log(info);
            MoveToInbox();
          }
      });
} // end Sendmail()


// run file after every interval
setInterval(Check_empty, 60000 );   // you can change this interval 
