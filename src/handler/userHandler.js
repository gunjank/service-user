'use strict';

const log = require('../config/logger'),
    requestModule = require('request'),
    mongoose = require('../dao/db'),
    userSchema = require('../model/userSchema'),
    userAddressSchema = require('../model/userAddressSchema'),
    userFavStationSchema = require('../model/userFavStationSchema'),
    userAccessTokenSchema = require('../model/userAccessTokenSchema'),
    Response = require('../model/response'),
    settings = require('../config/settings'),
    citiAuthHandler = require('./citiAuthHandler'),
    citiAccountsHandler = require('./citiAccountsHandler'),
    RefreshTokenPayload = require('../model/refreshTokenPayload');


const userCreateUpdateTransaction = function (data, cb) {
    const response = new Response();
    const UserModel = mongoose.model("UserProfileCollection", userSchema);
    const query = {
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

const accessTokenRefresh = function (refresh_token, cb) {
    const refreshTokenPayload = new RefreshTokenPayload();
    const response = new Response();
    refreshTokenPayload.grant_type = "refresh_token";
    refreshTokenPayload.refresh_token = refresh_token;
    citiAuthHandler.authTokenRefresh(refreshTokenPayload, (error, jsonBody) => {
        if (error) {
            response.statusCode = 0;
            response.message = " Unable to receive access token from refresh service";
            response.error = error;
        } else {
            response.statusCode = 1;
            response.message = " Successfully called refresh access token";
            response.data = jsonBody;
        }
        cb(response);
    });
};

const getUserAccountsHandler = (accessToken, cb) => {
    const response = new Response();
    citiAccountsHandler.getUserAccounts(accessToken, function (error, body) {
        if (error) {
            response.statusCode = 0;
            response.message = " Unable to receive access token from refresh service";
            response.error = error;
        } else {
            response.statusCode = 1;
            response.message = " Successfully called refresh access token";
            response.data = body;
        }
        cb(response);
    });
};
const getUserHandler = (userId, cb) => {
    const response = new Response();
    const UserModel = mongoose.model("UserProfileCollection", userSchema);
    UserModel.findOne({
        user_id: userId
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
        cb(response);
    })
}

const insertUpdateAccessToken = (userId, accessToken, refreshToken, cb) => {
    const response = new Response();
    const accessTokenPayload = {
        user_id: userId,
        access_token: accessToken
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

    const UserAccessTokenModel = mongoose.model("userAccessTokenCollection", userAccessTokenSchema);
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
        // whenever access_token update happens it is required to update refresh_token if available 
        if (null != refreshToken) {
            const userDataPayload = {};
            userDataPayload.user_id = userId;
            userDataPayload.refresh_token = refreshToken;
            userCreateUpdateTransaction(userDataPayload, function (userCreateUpdateTransactionResponse) {
                response.message = response.message + ", " + userCreateUpdateTransactionResponse.message;
                cb(response);
            });
        } else {
            cb(response);
        }
    });
}

const getAccountsWithRefreshTokenForGivenUserId = (userId, cb) => {
    getUserHandler(userId, (response) => {
        if (response.statusCode === 1 && null != response.data.refresh_token) {
            accessTokenRefresh(response.data.refresh_token, (refreshTokenResponse) => {
                if (refreshTokenResponse.statusCode === 1 && null != refreshTokenResponse.data.access_token) { //should have access token{
                    //insert access token into user access token collection
                    insertUpdateAccessToken(userId, refreshTokenResponse.data.access_token, refreshTokenResponse.data.refresh_token, (insertUpdateAccessTokenResponse) => {
                        if (insertUpdateAccessTokenResponse.statusCode === 1) {
                            getUserAccountsHandler(refreshTokenResponse.data.access_token, (userAccountsHandlerResponse) => {
                                cb(userAccountsHandlerResponse);
                            });
                        } else {
                            cb(insertUpdateAccessTokenResponse);
                        }
                    });
                } else { //don't have access token'
                    cb(refreshTokenResponse);
                }
            });

        } else {
            response.statusCode = 0; //override status code as refresh token not found
            response.message = "Authrization tokens not found";
            cb(response)
        }
    }); //end of getUserHandler
}; //end of getAccountsWithRefreshTokenForGivenUserId









// //exports start

const userHandler = {

        createOrUpdateUser: function (request, reply) {
            userCreateUpdateTransaction(request.payload, function (response) {
                reply(response);
            });
        },
        createOrUpdateUserAddress: function (request, reply) {
            const response = new Response;
            const UserAddressModel = mongoose.model("UserAddressCollection", userAddressSchema);
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
            const query = {
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
            const response = new Response;
            const UserFavStaationModel = mongoose.model("UserFavStationCollection", userFavStationSchema);
            const userFavStation = new UserFavStaationModel(request.payload);
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
            getUserHandler(request.params.userId, (response) => {
                reply(response);
            })
        },

        getUserAddressByType: function (request, reply) {
            const response = new Response;
            const AddressModel = mongoose.model("useraddresscollections", userSchema);
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
            const response = new Response;
            const UserModel = mongoose.model("UserProfileCollection", userSchema);
            const UserAddressSchema = mongoose.model("UserAddressCollection", userAddressSchema);
            const UserFavStationSchema = mongoose.model("UserFavStationCollection", userFavStationSchema);
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
        //start user accessToken - it will recive auth code return access token as well as refresh token
        accessToken: function (request, reply) {
            const response = new Response;
            const userId = request.payload.userId;
            delete request.payload.userId;
            //user don't have access token and refresh token'
            citiAuthHandler.authToken(request.payload, function (error, tokenBody) {
                if (error) {
                    response.statusCode = 0;
                    response.message = " access token service failed";
                } else if (null != tokenBody) //success case 
                {
                    if (null != tokenBody.access_token && null != tokenBody.refresh_token) //access_token available 
                    {
                        //good to go for insert /update
                        insertUpdateAccessToken(userId, tokenBody.access_token, tokenBody.refresh_token, (accessTokenUpsertResponse) => {

                            //now try to update refresh token under user profile collection
                            const userDataPayload = {};
                            userDataPayload.user_id = userId;
                            userDataPayload.refresh_token = tokenBody.refresh_token;
                            userCreateUpdateTransaction(userDataPayload, function (userInsertUpdateResponse) {
                                response.message = accessTokenUpsertResponse.message + ", " + userInsertUpdateResponse.message;
                                reply(response);
                            });
                        });

                    } else { //access_token/refresh_token null
                        response.statusCode = 0;
                        response.message = " access token service successful but access_token or refresh_token null";
                        reply(response);
                    }
                } else //response tokenBody null
                {
                    response.statusCode = 0;
                    response.message = " access token service called but didn't recive expected result ";
                    reply(response);
                }

            });
        }, //end of authcode
        //start for getUserAccounts
        getUserAccounts: function (request, reply) {
                const response = new Response;
                const userId = request.params.userId;
                const UserAccessTokenModel = mongoose.model("userAccessTokenCollection", userAccessTokenSchema);
                UserAccessTokenModel.findOne({
                    user_id: userId
                }, function (error, userAccessTokenResult) {
                    if (error) {
                        response.statusCode = 0;
                        response.message = " Unable to run query, got errors";
                        response.error = error;
                        reply(response);
                    } else if (userAccessTokenResult) { //found access token call account summary 
                        getUserAccountsHandler(userAccessTokenResult.access_token, (userAccountsHandlerResponse) => {
                            reply(userAccountsHandlerResponse);
                        });
                    } else { //no access_token  look for refresh_token as access_token may be expired
                        getAccountsWithRefreshTokenForGivenUserId(userId, (getAccountsWithRefreshTokenForGivenUserIdResponse) => {
                            reply(getAccountsWithRefreshTokenForGivenUserIdResponse);
                        })
                    }
                }); //endo fo UserAccessTokenModel.findOne
            } //end of method getUserAccounts
    } //end of module exports
module.exports = userHandler;
//test
// let req = {
//     params: {
//         userId: "11203502946677381"
//     }
// };
// let reply = function (obj) {
//     log.info({
//         re: obj
//     }, "test repy ")
// }

// userHandler.getUserAccounts(req, reply);