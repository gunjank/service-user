'use strict';

var request = require('request');
const settings = require('../config/settings');


let authorizationHeaders = function () {
    return {
        "Authorization": "Basic " + settings.citiAuthorization,
        "Content-Type": "application/x-www-form-urlencoded"
    }
};


let authTokenHandler = {



        authToken: function (payloadData, cb) {
            request({
                url: settings.authCodeUrl,
                method: 'POST',
                form: payloadData,
                headers: authorizationHeaders(),
            }, function (error, response, body) {
                if (error) log.error("authToken service failed " + error);
                if (response) log.info("authToken service successful and response status message is " + response.statusMessage);
                if (body != null) {
                    cb(null, body);
                } else {
                    log.info("authToken service - body is null");
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