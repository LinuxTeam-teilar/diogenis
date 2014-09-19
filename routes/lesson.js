var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

var lessonDb = require('../lib/db/lesson.js');

router.post('/create', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    lessonDb.create(req, res);
});

router.get('/list', routeMiddleware.isUser, function(req, res) {
    lessonDb.listAll(req, res);
});

router.post('/add/teacher', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    lessonDb.addTeacher(req, res);
});

router.post('/remove', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    lessonDb.remove(req, res);
});

module.exports = router;

