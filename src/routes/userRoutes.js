'use strict';

const userHandler = require('../handler/userHandler'),
    userSchema = require('../model/userSchema'),
    Joi = require('joi');

module.exports = function (server, options) {

    server.route({
        method: 'post',
        path: '/v1/user',
        config: {
            handler: userHandler.createOrUpdateUser,
            description: 'Create a new user, if already existed then update',
            notes: 'insert or upsert',
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    first_name: Joi.string(),
                    last_name: Joi.string(),
                    user_id: Joi.string().required()
                })
            }
        }
    });

    server.route({
        method: 'post',
        path: '/v1/user/address',
        config: {
            handler: userHandler.createOrUpdateUserAddress,
            description: 'Create a new user address if already existed then update',
            notes: 'insert or upsert',
            tags: ['api'],
            validate: {
                payload: Joi.object().keys({
                    user_id: Joi.string().required(),
                    lon: Joi.number(),
                    lat: Joi.number(),
                    type: Joi.string(),
                    address_str: Joi.string(),
                    loc: Joi.array().items(Joi.number(), Joi.number())
                })
            }
        }
    });
    server.route({
        method: 'post',
        path: '/v1/user/favourite',
        config: {
            handler: userHandler.createOrUpdateUserFavStation,
            description: 'Create a new user address if already existed then update',
            notes: 'insert or upsert',
            tags: ['api'],
            validate: {
                payload: Joi.object().keys({
                    user_id: Joi.string().required(),
                    lon: Joi.number(),
                    lat: Joi.number(),
                    type: Joi.string(),
                    address_str: Joi.string(),
                    loc: Joi.array()
                })
            }
        }
    });

    server.route({
        method: 'put',
        path: '/v1/user',
        config: {
            handler: userHandler.createOrUpdateUser,
            description: 'update  user if already exist',
            notes: 'given user id should be present in db',
            tags: ['api'],
            validate: {
                payload: Joi.object().keys({
                    first_name: Joi.string(),
                    last_name: Joi.string(),
                    user_id: Joi.string()

                })
            }
        }
    });
    //get user 
    server.route({
        method: 'get',
        path: '/v1/user/{userId}',
        config: {
            handler: userHandler.getUser,
            description: 'get  user if already exist by user id',
            notes: 'given user id should be present in db',
            tags: ['api'],
            validate: {
                params: {
                    userId: Joi.string()
                }

            }
        }
    });
    //user favourite_stations
    // server.route({
    //     method: 'get',
    //     path: '/v1/user/{userId}/favourite',
    //     config: {
    //         handler: userHandler.getUserFavourite,
    //         description: 'get  user if already exist by user id',
    //         notes: 'given user id should be present in db',
    //         tags: ['api'],
    //         validate: {
    //             params: {
    //                 userId: Joi.string()
    //             }

    //         }
    //     }
    // });

    //user address with type 
    server.route({
        method: 'get',
        path: '/v1/user/{userId}/address/{type}',
        config: {
            handler: userHandler.getUserAddressByType,
            description: 'Get  user address if already exist for given user id',
            notes: 'Given user id and address type should be present in db',
            tags: ['api'],
            validate: {
                params: {
                    userId: Joi.string().required(),
                    type: Joi.string().required()
                }

            }
        }
    });
    //delete user 
    server.route({
        method: 'delete',
        path: '/v1/user/{userId}',
        config: {
            handler: userHandler.removeUser,
            description: 'remove user if already exist',
            notes: 'given user id should be present in db',
            tags: ['api'],
            validate: {
                params: {
                    userId: Joi.string()
                }

            }
        }
    });
    //get access token by providing authorization code
    server.route({
        method: 'post',
        path: '/v1/user/accessToken',
        config: {
            handler: userHandler.accessToken,
            description: 'Insert/update access token and refresh token for given user id and auth code ',
            notes: 'Redirect url should be same used for auth code',
            tags: ['api'],
            validate: {
                payload: Joi.object().keys({
                    grant_type: Joi.string().required(),
                    code: Joi.string().required(),
                    redirect_uri: Joi.string().required(),
                    userId: Joi.string().required()
                })
            }
        }
    }); //end of access token route

    //user address with type 
    server.route({
        method: 'get',
        path: '/v1/user/{userId}/accounts',
        config: {
            handler: userHandler.getUserAccounts,
            description: 'Returns a summary of all credit card accounts held by a Citi customer who has authorized your app',
            notes: 'If a customer has multiple credit card accounts, e.g. a Citi® AAdvantage® Card and a Citi ThankYou® Card, the accounts will be returned in the array accountGroupSummary',
            tags: ['api'],
            validate: {
                params: {
                    userId: Joi.string().required()
                }

            }
        }
    });

}; //end of module.export function