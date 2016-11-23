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
module.exports = accountsHandler;