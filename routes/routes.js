var express = require('express');
var app = express();

var index = require('./index.js');
var university = require('./university.js');
var department = require('./department.js');

app.use('/', index);
app.use('/university', university);
app.use('/department', department);

