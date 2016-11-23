'use strict';

const cfenv = require("cfenv"),
    appEnv = cfenv.getAppEnv(),
    base64 = require('base-64'),
    log = require('./logger');
let mLabService = appEnv.getService('mongo_cb');
let citiAuth = appEnv.getService('citi_auth');
let mLabServiceUrl = "";
let citiClientCredentials = null;
let clientIdAndSecretBase64 = null;

const mLabServiceCredentials = function () {
    //** local testing **//
    if (mLabService == null) {
        log.error('mLabService not available, reading local hardcoded values');
        const dummyData = require('./notToCommit');
        mLabService = {};
        mLabService.credentials = {};
        mLabService.credentials.uri = {};
        mLabService.credentials.uri = dummyData.mongoUrl;
    } else {
        log.info('mLabService  available, reading  service details');
    }
    mLabServiceUrl = mLabService.credentials.uri;
}

const getCitiClientCredentials = function () {
    if (citiAuth == null) {
        log.error('citiAuthClientId or citiAuthClientSecret not available, reading local hardcoded values');
        const dummyData = require('./notToCommit');
        citiAuth = {};
        citiAuth.credentials = {};
        citiAuth.credentials.client_id = dummyData.client_id;
        citiAuth.credentials.client_secret = dummyData.client_secret;
    } else {
        log.info('citiAuthClientId and  citiAuthClientSecret are  available, reading  service details');
    }
    citiClientCredentials = citiAuth.credentials;
}
const getClientIdAndSecretBase64 = function () {
    clientIdAndSecretBase64 = "Basic " + base64.encode(citiClientCredentials.client_id + ":" + citiClientCredentials.client_secret);
}
const initialize = function () { //intilize all bootstrapping credentials
    getCitiClientCredentials();
    getClientIdAndSecretBase64();
    mLabServiceCredentials();
}

const settings = {
    init: initialize(), //this will make sure we have citiAuth credentials
    gbfsBase: 'https://gbfs.citibikenyc.com/gbfs/',
    gbfsFeed: 'gbfs.json',
    system_regions: 'en/system_regions.json',
    system_information: 'en/system_information.json',
    station_status: 'en/station_status.json',
    station_information: 'en/station_information.json',
    system_alerts: 'en/system_alerts.json',
    mongoUrl: mLabServiceUrl,
    accessTokenUrl: 'https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/token/us/gcb',
    accessTokenRefreshUrl: 'https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/refresh',
    accessTokenRevokeUrl: 'https://sandbox.apihub.citi.com/gcb/api/authCode/oauth2/revoke',
    citiAccountsApiUrl: 'https://sandbox.apihub.citi.com/gcb/api/v1/accounts',
    citiClientIdAndSecretBasic: clientIdAndSecretBase64,
    citiClientId: citiClientCredentials.client_id,
    port: process.env.PORT || 3001
}
module.exports = settings;