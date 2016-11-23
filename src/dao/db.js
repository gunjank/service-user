'use strict';

const log = require('../config/logger'),
    mongoose = require("mongoose"),
    settings = require('../config/settings');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
const uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    settings.mongoUrl;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.Promise = global.Promise; //this is required to avoid deprication warning from mongoose 
mongoose.connect(uristring, function (err, res) {
    if (err) {
        log.error('ERROR connecting to: DB with error -  ' + '. ' + err);
    } else {
        log.info('Connected to: DB');
    }
});
module.exports = mongoose;