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
            if (error) log.error("authTokenRevoke service failed " + error);
            if (response) log.info("authTokenRevoke service successful and response status message is " + response.statusMessage);
            if (body != null) {
                cb(null, body);
            } else {
                log.info("authTokenRevoke service - body is null");
                cb(error, null);
            }
        });
    }


}

//test
// console.log(authorizationHeaders());
// let payloadData = {
//     grant_type: "authorization_code",
//     code: "AAJEsqoJ3KgZV0FLLAEgOia3zypaco1NxosgFsuTcE7HcfUvkJR18_mpSrne7Q1yEKF1RxS5KFxSHi9S6adr6z45xhzD_LYNgjBBlMK8-u0JuCT1c_xXZl7F3PwDIVXwZZHwHhSV5NQibeiC-oBhNaE1WJZ4ijooYwJ9Q8SNvfvUGxtveEK1vaEqVunrK_zKfqi5tYCdh9clvt4MzuukLXb696GITolM_KpMgTZyK4Q3Tw",
//     redirect_uri: "https://service-user.cfapps.io"
// };
// authTokenHandler.authToken(payloadData, function (error, body) {
//     console.log("response from authCode " + error + " --  " + JSON.stringify(body));
// });
module.exports = authTokenHandler;