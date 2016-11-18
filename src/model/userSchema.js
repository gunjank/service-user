'use strict';

var mongoose = require('../dao/db');

let schema = new mongoose.Schema({

    first_name: String,
    last_name: String,
    user_id: String,
    refresh_token: String

});
module.exports = schema;