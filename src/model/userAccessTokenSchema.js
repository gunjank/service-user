'use strict';

var mongoose = require('../dao/db');

let schema = new mongoose.Schema({
    "createdAt": {
        type: Date,
        expires: 3530,
        default: Date.now
    }, //almost 1 minute few seconds  less than  one hour
    user_id: String,
    access_token: String
});
module.exports = schema;