var express = require('express');
var path = require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

require('./middleware.js')(app);

// TODO remove the public dir
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client')));

require('./routes/routes.js')(app);

module.exports = app;

