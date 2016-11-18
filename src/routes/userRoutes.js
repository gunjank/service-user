'use strict';

const userHandler = require('../handler/userHandler');
let userSchema = require('../model/userSchema');
const Joi = require('joi');

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
                description: 'update  usser if already exist',
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
                description: 'get  usser if already exist by user id',
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
        //         description: 'get  usser if already exist by user id',
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
                description: 'get  usser if already exist by user id',
                notes: 'given user id should be present in db',
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
                description: 'remove usser if already exist',
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
            path: '/v1/user/authCode',
            config: {
                handler: userHandler.authCode,
                description: 'Get an access token by passing auth code',
                notes: 'You also get a refresh token that can be used to get a new access token in case the original one expires',
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
        });
    } //end of module.export function