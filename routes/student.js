var express = require('express');
var router = express.Router();

var studentDb = require('../lib/db/student.js');

router.post('/auth', function(req, res) {
    studentDb.auth(req, res);
});

module.exports = router;

