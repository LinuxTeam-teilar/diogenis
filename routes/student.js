var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

var studentDb = require('../lib/db/student.js');

router.post('/auth', function(req, res) {
    studentDb.auth(req, res);
});

router.post('/add/record', routeMiddleware.isTeacher, function(req, res) {
    studentDb.addRecord(req, res);
});

module.exports = router;

