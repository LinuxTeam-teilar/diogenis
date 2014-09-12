var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

var labDb = require('../lib/db/lab.js');

router.post('/create', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    labDb.create(req, res);
});

router.get('/list', routeMiddleware.isUser, function(req, res) {
    labDb.list(req, res);
});

router.post('/add/student', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    labDb.addStudent(req, res);
});

router.post('/remove/student', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    labDb.removeStudent(req, res);
});

module.exports = router;

