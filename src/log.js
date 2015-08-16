var winston = require('winston');
/*
  Uses Winston : https://github.com/winstonjs/winston
*/
module.exports = new winston.Logger();

if (process.env.NODE_ENV != "production")
  module.exports.add(winston.transports.Console);
