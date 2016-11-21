'use strict';

const bunyan = require('bunyan');
//log class will now globally available
const log = bunyan.createLogger({
    name: 'service-user',
    serializers: bunyan.stdSerializers
});

module.exports = log;