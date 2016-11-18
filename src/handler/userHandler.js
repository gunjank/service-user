'use strict';

let requestModule = require('request');
let mongoose = require('../dao/db');
let userSchema = require('../model/userSchema');
let userAddressSchema = require('../model/userAddressSchema');
let userFavStationSchema = require('../model/userFavStationSchema');
let userAccessTokenSchema = require('../model/userAccessTokenSchema');
let Response = require('../model/response');
let settings = require('../config/settings');
let citiAuthHandler = require('./citiAuthHandler');


let userCreateUpdateTransaction = function (data, cb) {
    let response = new Response;
    let UserModel = mongoose.model("UserProfileCollection", userSchema);
    var query = {
            user_id: data.user_id
        },
        update = data,
        options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
    // Find the document
    UserModel.findOneAndUpdate(query, update, options, function (error, result) {
        if (error) {
            response.statusCode = 0;
            response.message = " Unable to saved latest data into user collection";
            response.error = error;
        } else {
            response.statusCode = 1;
            response.message = " Saved latest data into user collection";
            response.data = result;
        }
        cb(response);

    });
}






// //exports start

const userHandler = {

        createOrUpdateUser: function (request, reply) {
            userCreateUpdateTransaction(request.payload, function (response) {
                reply(response);
            });
        },
        createOrUpdateUserAddress: function (request, reply) {
            let response = new Response;
            let UserAddressModel = mongoose.model("UserAddressCollection", userAddressSchema);
            /**
             * temporary fix for address type lowercase 
             * evem after settomg lowercase in schema type is saving as it is
             * start 
             *  */
            if (request.payload.type != null) {
                request.payload.type = request.payload.type.toLowerCase();
            }
            /**
             * end 
             */
            var query = {
                    user_id: request.payload.user_id,
                    type: request.payload.type
                },
                update = request.payload,
                options = {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                };
            // Find the document
            UserAddressModel.findOneAndUpdate(query, update, options, function (error, result) {
                if (error) {
                    response.statusCode = 0;
                    response.message = " Unable to saved latest data into DB";
                    response.error = error;
                } else {
                    response.statusCode = 1;
                    response.message = " Saved latest data into DB";
                    response.data = result;
                }
                reply(response);
            });

        },
        createOrUpdateUserFavStation: function (request, reply) {
            let response = new Response;
            let UserFavStaationModel = mongoose.model("UserFavStationCollection", userFavStationSchema);
            let userFavStation = new UserFavStaationModel(request.payload);
            // Find the document
            userFavStation.save(function (error, result) {
                if (error) {
                    response.statusCode = 0;
                    response.message = " Unable to saved latest data into DB";
                    response.error = error;
                } else {
                    response.statusCode = 1;
                    response.message = " Saved latest data into DB";
                    response.data = result;
                }
                reply(response);
            });
        },
        getUser: function (request, reply) {
            let response = new Response;
            let UserModel = mongoose.model("UserProfileCollection", userSchema);
            UserModel.findOne({
                user_id: request.params.userId
            }, function (error, result) {
                if (error) {
                    response.statusCode = 0;
                    response.message = " Unable to run query, got errors";
                    response.error = error;
                } else if (result) {
                    response.statusCode = 1;
                    response.message = " Able to geta data from DB";
                    response.data = result;
                } else {
                    response.statusCode = 0;
                    response.message = "No matching record found";
                }
                reply(response);
            })
        },

        getUserAddressByType: function (request, reply) {
            let response = new Response;
            let AddressModel = mongoose.model("useraddresscollections", userSchema);
            if (null != request.params.type) {
                request.params.type = request.params.type.toLowerCase(); //as address type always saved in lower case
            }
            AddressModel.find({
                user_id: request.params.userId,
                type: request.params.type

            }, function (error, result) {
                if (error) {
                    response.statusCode = 0;
                    response.message = " Unable to run query, got errors";
                    response.error = error;
                } else if (result && result.length > 0) {
                    response.statusCode = 1;
                    response.message = " Able to geta data from DB";
                    response.data = result;

                } else {
                    response.statusCode = 0;
                    response.message = "No matching record found";
                }
                reply(response);
            })
        },
        // getUserFavourite : function (request, reply) {
        //future requirement
        // },
        removeUser: function (request, reply) { //it will remove user as well as related addresses if any and user favourite station if any
            let response = new Response;
            let UserModel = mongoose.model("UserProfileCollection", userSchema);
            let UserAddressSchema = mongoose.model("UserAddressCollection", userAddressSchema);
            let UserFavStationSchema = mongoose.model("UserFavStationCollection", userFavStationSchema);
            UserModel.findOneAndRemove({
                user_id: request.params.userId
            }, function (error, result) {
                if (error) {
                    response.statusCode = 0;
                    response.message = "user delete - failed to run query";
                    response.error = error;
                } else if (result) {
                    response.statusCode = 1;
                    response.message = " user delete completed";
                    response.data = result;

                } else {
                    response.statusCode = 0;
                    response.message = " No matching user record found to delete";
                }
                UserAddressSchema.remove({
                    user_id: request.params.userId
                }, function (error, result) {
                    if (error) {
                        response.statusCode = 0;
                        response.message += " ; user address delete - failed to run query";
                        response.error = error;
                    } else if (result) {
                        response.statusCode = 1;
                        response.message += " ; user address delete completed";
                        response.data = result;

                    } else {
                        response.statusCode = 0;
                        response.message += " ; No matching user address record found to delete";
                    }
                    UserFavStationSchema.remove({
                        user_id: request.params.userId
                    }, function (error, result) {
                        if (error) {
                            response.statusCode = 0;
                            response.message += " ; user favourite station delete - failed to run query";
                            response.error = error;
                        } else if (result) {
                            response.statusCode = 1;
                            response.message += " ; user favourite station delete completed";
                            response.data = result;

                        } else {
                            response.statusCode = 0;
                            response.message += " No matching user favourite station  record found to delete";
                        }
                        reply(response);
                    });
                });
            })
        }, //end of remove user
        //start user authcode - it will recive auth code return access token as well as refresh token
        authCode: function (request, reply) {
                let response = new Response;
                const userId = request.payload.userId;
                delete request.payload.userId;
                citiAuthHandler.authToken(request.payload, function (error, body) {
                    console.log("autho tocken service response body " + JSON.stringify(body));
                    if (error) {
                        response.statusCode = 0;
                        response.message = " access token service failed";
                    } else if (null != body) //success case 
                    {
                        let tokenBody = JSON.parse(body);
                        if (null != tokenBody.access_token && null != tokenBody.refresh_token) //access_token available 
                        {
                            //good to go for insert /update
                            const accessTokenPayload = {
                                user_id: userId,
                                access_token: tokenBody.access_token
                            };
                            const query = {
                                    user_id: userId
                                },
                                update = accessTokenPayload,
                                options = {
                                    upsert: true,
                                    new: true,
                                    setDefaultsOnInsert: true
                                };

                            let UserAccessTokenModel = mongoose.model("userAccessTokenCollection", userAccessTokenSchema);
                            UserAccessTokenModel.findOneAndUpdate(query, update, options, function (error, result) {
                                if (error) {
                                    response.statusCode = 0;
                                    response.message = " Unable to saved latest data into user access_token";
                                    response.error = error;
                                } else {
                                    response.statusCode = 1;
                                    response.message = " Saved latest data into user access_token";
                                    response.data = result;
                                }
                                let userDataPayload = {};
                                userDataPayload.user_id = userId;
                                userDataPayload.refresh_token = tokenBody.refresh_token;

                                userCreateUpdateTransaction(userDataPayload, function (userInsertUpdateResponse) {
                                    response.message = response.message + ", " + userInsertUpdateResponse.message;
                                    reply(response);
                                })




                            });
                            //////////////////////
                        } else { //access_token/refresh_token null
                            response.statusCode = 0;
                            response.message = " access token service successful but access_token or refresh_token null";
                            reply(response);
                        }
                    } else //response body null
                    {
                        response.statusCode = 0;
                        response.message = " access token service called but didn't recive expected result ";
                        reply(response);
                    }

                });
            } //end of authcode

    } //end of module exports
module.exports = userHandler;