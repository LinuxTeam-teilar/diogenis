var express = require('express');
var router = express.Router();
var routeMiddleware = require('./middleware.js');

var teacherDb = require('../lib/db/teacher.js');

router.post('/create', routeMiddleware.isSecretary, function(req, res) {
    teacherDb.create(req, res);
});

module.exports = router;

