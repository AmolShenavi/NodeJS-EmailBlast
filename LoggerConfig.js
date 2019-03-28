/*
        This is Logger config file 
*/
'use strict';
const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const logDir = config.LogDir;

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(config.LogDir, config.LogFile);

const logger = createLogger({
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message} `)
            )
        }),
        new transports.File({ filename })
    ]
});
//  Export logger so other files can use 
module.exports = logger;
