var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

var classroomDb = require('../lib/db/classroom.js');

router.post('/create', routeMiddleware.isSecretary, function(req, res) {
    classroomDb.create(req, res);
});

router.post('/rename', routeMiddleware.isSecretary, function(req, res) {
    classroomDb.rename(req, res);
});

router.post('/use', routeMiddleware.isSecretaryOrTeacher, function(req, res) {
    classroomDb.use(req, res);
});

module.exports = router;

