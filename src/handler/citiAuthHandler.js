'use strict';

const log = require('../config/logger'),
    request = require('request'),
    settings = require('../config/settings');


const authorizationHeaders = function () {
    return {
        "Authorization": settings.citiClientIdAndSecretBasic,
        "Content-Type": "application/x-www-form-urlencoded"
    }
};

const authTokenHandler = {
    authToken: function (formData, cb) {
        request({
            url: settings.accessTokenUrl,
            method: 'POST',
            form: formData,
            headers: authorizationHeaders(),
        }, function (error, response, body) {

            if (error) {
                log.error({
                    error: error
                }, "authToken service failed ");
                cb(error, null);
            } else if (response.statusCode === 200) { //valid json body 
                log.info("authToken service successful");
                cb(null, JSON.parse(body));
            } else { //non 200 status
                log.error({
                    error: response
                }, "authToken service successful but unexpected statusCode  ");
                cb(response, null);
            };
        });
    },

    authTokenRefresh: function (formData, cb) {
        request({
            url: settings.accessTokenRefreshUrl,
            method: 'POST',
            form: formData,
            headers: authorizationHeaders(),
        }, function (error, response, body) {
            if (error) {
                log.error({
                    error: error
                }, "authTokenRefresh service failed ");
                cb(error, null);
            } else if (response.statusCode === 200) { //valid json body 
                log.info("authTokenRefresh service successful");
                cb(null, JSON.parse(body));
            } else { //non 200 status
                log.error({
                    error: response
                }, "authTokenRefresh service successful but unexpected statusCode  ");
                cb(response, null);
            };
        });
    },

    authTokenRevoke: function (formData, cb) {
            request({
                url: settings.accessTokenRevokeUrl,
                method: 'POST',
                form: formData,
                headers: authorizationHeaders(),
            }, function (error, response, body) {

                if (error) {
                    log.error({
                        error: error
                    }, "authTokenRevoke service failed ");
                    cb(error, null);
                } else if (response.statusCode === 200) { //valid json body 
                    log.info("authTokenRevoke service successful");
                    cb(null, JSON.parse(body));
                } else { //non 200 status
                    log.error({
                        error: response
                    }, "authTokenRevoke service successful but unexpected statusCode  ");
                    cb(response, null);
                };
            });
        } //end of authTokenRevoke
}; //end of exports

module.exports = authTokenHandler;