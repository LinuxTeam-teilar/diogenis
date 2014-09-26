var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

var labDb = require('../lib/db/lab.js');

router.post('/create', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    labDb.create(req, res);
});

router.post('/remove', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    labDb.remove(req, res);
});

router.get('/list', routeMiddleware.isUser, function(req, res) {
    labDb.list(req, res);
});

router.post('/add/student', routeMiddleware.isStudent, function(req, res) {
    labDb.addStudent(req, res);
});

router.post('/remove/student', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    labDb.removeStudent(req, res);
});

router.post('/add/laptop', routeMiddleware.isTeacher, function(req, res) {
    labDb.addLaptop(req, res);
});

router.post('/remove/laptop', routeMiddleware.isTeacher, function(req, res) {
    labDb.removeLaptop(req, res);
});

module.exports = router;

