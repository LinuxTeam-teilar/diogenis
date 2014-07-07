var ini = require('ini');
var fs = require('fs')
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);


module.exports = function(app) {
    var config = ini.parse(fs.readFileSync(process.cwd() + '/diogenis.conf', 'utf-8'))

    app.use(favicon());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());

    var options = {
        host: config.redis.redis_host,
        prefix: config.redis.redis_prefix
    };

    app.use(session({ store: new RedisStore(options),
                      secret: config.redis.redis_cookie_secret,
                      saveUninitialized: true,
                      resave: true }));
};

