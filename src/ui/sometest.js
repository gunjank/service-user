// var options = {
//     host: "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAB9xh1iLUMBALOO43Ad1FviafvTib2vh86RlX5iQ2gomHGOjZB2SCBHd5hKpHZBTWGYm8TyO1nla63UVgIZCy9c1Ov8MOpsqGiw2IAULKkmzhEEZCXWOhqI9ZCcJQUXU4n1IajkHVFIHh5ryGL0iNXz56nNenHLEZBDU5caCpDTXSHXfaGd9v",
//     port: 443,

//     method: 'POST'
// };

// http.request(options, function (res) {
//     console.log('STATUS: ' + res.statusCode);
//     console.log('HEADERS: ' + JSON.stringify(res.headers));
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//         console.log('BODY: ' + chunk);
//     });
// }).end();


// curl - X POST - H "Content-Type: application/json" - d '{  "setting_type" : "domain_whitelisting",  "whitelisted_domains" : ["https://sandbox.apihub.citi.com"],  "domain_action_type": "add"}'
// "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAB9xh1iLUMBALOO43Ad1FviafvTib2vh86RlX5iQ2gomHGOjZB2SCBHd5hKpHZBTWGYm8TyO1nla63UVgIZCy9c1Ov8MOpsqGiw2IAULKkmzhEEZCXWOhqI9ZCcJQUXU4n1IajkHVFIHh5ryGL0iNXz56nNenHLEZBDU5caCpDTXSHXfaGd9v"


// var request = require('request');
// request.post({
//     headers: {
//         'content-type': 'application/json'
//     },
//     method: 'POST',
//     url: 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAB9xh1iLUMBALOO43Ad1FviafvTib2vh86RlX5iQ2gomHGOjZB2SCBHd5hKpHZBTWGYm8TyO1nla63UVgIZCy9c1Ov8MOpsqGiw2IAULKkmzhEEZCXWOhqI9ZCcJQUXU4n1IajkHVFIHh5ryGL0iNXz56nNenHLEZBDU5caCpDTXSHXfaGd9v',
//     json: {
//         "setting_type": "domain_whitelisting",
//         "whitelisted_domains": ["https://sandbox.apihub.citi.com"],
//         "domain_action_type": "add"
//     }
// }, function (error, response, body) {
//     console.log(body);
// });

var request = require('request');
request.get({
    headers: {
        'content-type': 'application/json'
    },
    method: 'GET',
    url: 'https://graph.facebook.com/v2.6/me?access_token=EAAB9xh1iLUMBALOO43Ad1FviafvTib2vh86RlX5iQ2gomHGOjZB2SCBHd5hKpHZBTWGYm8TyO1nla63UVgIZCy9c1Ov8MOpsqGiw2IAULKkmzhEEZCXWOhqI9ZCcJQUXU4n1IajkHVFIHh5ryGL0iNXz56nNenHLEZBDU5caCpDTXSHXfaGd9v&fields=recipient&account_linking_token=ACCOUNT_LINKING_TOKEN'

}, function (error, response, body) {
    console.log(body);
});