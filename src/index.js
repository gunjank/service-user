'use strict';

const log = require('./config/logger'),
  path = require('path'),
  Lout = require('lout'),
  Good = require('good'),
  GoodFile = require('good-file'),
  q = require('q'),
  Hapi = require('hapi'),
  Inert = require('inert'),
  Vision = require('vision'),
  HapiSwagger = require('hapi-swagger'),
  Pack = require('../package'),
  settings = require('./config/settings');

/**
 * Construct the server
 */
const server = new Hapi.Server({
  connections: {
    routes: {
      cors: true,
      log: true
    },
    router: {
      stripTrailingSlash: true
    }
  }
});
log.info('server constructed');

/**
 * Create the connection
 */
server.connection({
  port: settings.port

});
const swaggerOptions = {
  info: {
    'title': 'Service-User API Documentation',
    'version': Pack.version
  }
};

server.register([Inert, Vision, {
  'register': HapiSwagger,
  'options': swaggerOptions
}], function (err) {
  if (err)
    log.info("Inert or Vision plugin failed, it will stop swagger");
});

/**
 * Build a logger for the server & each service
 */
const reporters = [new GoodFile({
  log: '*'
}, __dirname + '/../logs/server.log')];

//if you want to serve static files 
server.route({
  method: 'get',
  path: '/{param*}',
  handler: {
    directory: {
      path: __dirname + '/../src/ui',
      listing: true
    }
  }
});

/**
 * Add logging
 */
server.register({
  register: Good,
  options: {
    opsInterval: 1000,
    reporters: reporters
  }
}, function (err) {
  if (err)
    throw new Error(err);

  log.debug({
    reporters: reporters
  }, 'registered Good for logging with reporters');
});

/**
 * Add /docs route
 */
server.register({
  register: Lout
}, function (err) {
  if (err)
    throw new Error(err);

  log.debug('added Lout for /docs');
});

/**
 * If this isn't for testing, start the server
 */

server.start(function (err) {
  if (err)
    throw new Error(err);
  log.info('server started!');
  const summary = server.connections.map(function (cn) {
    return {
      labels: cn.settings.labels,
      uri: cn.info.uri
    };
  });
  require(__dirname + '/routes/userRoutes')(server); //initialize router
  log.info({
    connSummary: summary
  }, 'Connections summary ');
  server.log('server', 'started: ' + JSON.stringify(summary));
});

module.exports = server;