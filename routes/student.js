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

router.get('/list/labs', routeMiddleware.isStudent, function(req, res) {
    studentDb.listLabs(req, res);
});

router.post('/remove/lab', routeMiddleware.isStudent, function(req, res) {
    studentDb.removeLab(req, res);
});

module.exports = router;

