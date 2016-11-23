'use strict';

const mongoose = require('../dao/db');

const schema = new mongoose.Schema({

    first_name: String,
    last_name: String,
    user_id: String,
    refresh_token: String

});
module.exports = schema;