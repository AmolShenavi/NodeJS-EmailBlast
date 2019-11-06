# NodeJS-EmailBlast

- Node Application
- Send Emails in bulk

# Requirements
- Sender's email address
- Sender's email password
- Receiver's email address
- SMTP Port number
- Mail body
- Mail Subjet

# Steps for configuration
## Set email details in [config file](./config.js)
```json
...
    myemail    : "<YourEmailAddress>",
    mypassword : "<Password>" ,   
...
```
| Variable           |        Description                          | 
|:-----------------  |:--------------------------------------------|  
| YourEmailAddress   | Sender's email address                      |
| Password           | Password of email address                   | 

## Mail Configuration
**Note** : The json file of each mail should have the following syntax with `.json` file and should be stored in `Outbox` folder.

```json
  {
    "to":"<emailAddress1>",
    "cc":"<emailAddress2>",
    "subject":"<EmailSubject>",
    "body":"<MessageBody>"
}
```
| Variable           |        Description                                          | 
|:-----------------  |:------------------------------------------------------------|  
| emailAddress1     | Receiver's email address                          |
| emailAddress2   | Email address of carbon copy to be send(compulsory field)     | 
| EmailSubject        | Specific subject of mail.                        | 
| MessageBody        | Main content of mail.                        | 

### For example 
```json 
{
    "to":"sam@gmail.com",
    "cc":"jon@gmail.com",
    "subject":"NodeJS first application",
    "body":"Dear, This is my first NodeJS application. "
}
```

# Steps for Execution

## To install node modules 
> npm install 

## To run application
> node MailBlast.js

## To close application 
- Press `Ctrl + c`