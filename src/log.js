var winston = require('winston');
/*
  Uses Winston : https://github.com/winstonjs/winston
*/
module.exports = new winston.Logger();
module.exports.add(winston.transports.Console);
