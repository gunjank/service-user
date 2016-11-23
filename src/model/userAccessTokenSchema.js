'use strict';

const mongoose = require('../dao/db');

const schema = new mongoose.Schema({
    "createdAt": {
        type: Date,
        expires: 3530, //access token expires_in=3600
        default: Date.now
    }, //almost 1 minute few seconds  less than  one hour
    user_id: String,
    access_token: String
});
module.exports = schema;