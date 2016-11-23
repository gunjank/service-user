'use strict';

const log = require('../config/logger'),
    request = require('request'),
    settings = require('../config/settings'),
    uuid = require('node-uuid');

const authorizationHeaders = function (accessToken) {
    return {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json",
        "uuid": uuid.v1(),
        "client_id": settings.citiClientId
    }
};

const accountsHandler = {
    getUserAccounts: function (accessToken, cb) {
        request({
            url: settings.citiAccountsApiUrl,
            method: 'GET',
            headers: authorizationHeaders(accessToken),
        }, function (error, response, body) {
            if (error) {
                log.error({
                    error: error
                }, "getUserAccounts service failed ");
                cb(error, null);
            } else if (response.statusCode === 200) { //valid json body 
                log.info("getUserAccounts service successful ");
                cb(null, JSON.parse(body));
            } else { //non 200 status
                log.error({
                    error: response
                }, "getUserAccounts service successful but unexpected statusCode  ");
                cb(response, null);
            };
        });
    },
}

module.exports = accountsHandler;