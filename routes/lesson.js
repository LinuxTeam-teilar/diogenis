var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

var lessonDb = require('../lib/db/lesson.js');

router.post('/create', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    lessonDb.create(req, res);
});

router.post('/recordsPresence', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    lessonDb.recordsPresence(req, res);
});

router.get('/list/:departmentId', function(req, res) {
    lessonDb.listAll(req, res);
});

router.post('/add/student', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    lessonDb.addStudent(req, res);
});

module.exports = router;

