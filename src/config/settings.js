'use strict';

const cfenv = require("cfenv");
let appEnv = cfenv.getAppEnv();
let mLabService = appEnv.getService('mongo_cb');
let citiAuth = appEnv.getService('citi_auth');
let base64 = require('base-64');

let mLabServiceCredentials = function () {
    //** local testing **//
    if (mLabService == null) {
        // log.error('mLabService not available, reading local hardcoded values');
        let dummyData = require('./notToCommit');
        mLabService = {};
        mLabService.credentials = {};
        mLabService.credentials.uri = {};
        mLabService.credentials.uri = dummyData.mongoUrl;
    } else {
        log.info('mLabService  available, reading  service details');
    }
    return mLabService.credentials.uri;
}
let getAuthorizationBase64 = function () {
    if (citiAuth == null) {
        // log.error('citiAuthClientId or citiAuthClientSecret not available, reading local hardcoded values');
        let dummyData = require('./notToCommit');
        citiAuth = {};
        citiAuth.credentials = {};
        citiAuth.credentials.client_id = dummyData.client_id;
        citiAuth.credentials.client_secret = dummyData.client_secret;
    } else {
        log.info('citiAuthClientId and  citiAuthClientSecret are  available, reading  service details');
    }
    //console.log(citiAuthClientId + ":" + citiAuthClientSecret);
    return base64.encode(citiAuth.credentials.client_id + ":" + citiAuth.credentials.client_secret);
}

let settings = {
    gbfsBase: 'https://gbfs.citibikenyc.com/gbfs/',
    gbfsFeed: 'gbfs.json',
    system_regions: 'en/system_regions.json',
    system_information: 'en/system_information.json',
    station_status: 'en/station_status.json',
    station_information: 'en/station_information.json',
    system_alerts: 'en/system_alerts.json',
    mongoUrl: mLabServiceCredentials(),
    authCodeUrl: 'https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/token/us/gcb',
    citiAuthorization: getAuthorizationBase64(),
    port: process.env.PORT || 3001
}

module.exports = settings;