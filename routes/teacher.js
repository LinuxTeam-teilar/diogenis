var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

var teacherDb = require('../lib/db/teacher.js');

router.post('/create', routeMiddleware.isSecretary, function(req, res) {
    teacherDb.create(req, res);
});

router.post('/auth', function(req, res) {
    teacherDb.auth(req, res);
});

router.get('/list', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    teacherDb.listAll(req, res);
});

router.get('/list/students', routeMiddleware.isTeacher, function(req, res) {
    teacherDb.listStudents(req, res);
});

module.exports = router;

