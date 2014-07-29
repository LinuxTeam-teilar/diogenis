var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

var semesterDb = require('../lib/db/semester.js');

router.post('/create', routeMiddleware.isSecretary, function(req, res) {
    semesterDb.create(req, res);
});

router.post('/lesson/add', routeMiddleware.isSecretary, function(req, res) {
    semesterDb.addLesson(req, res);
});

module.exports = router;

