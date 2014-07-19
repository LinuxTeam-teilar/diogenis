var express = require('express');
var router = express.Router();

var secretaryDb = require('../lib/db/secretary.js');

router.post('/auth', function(req, res) {
    secretaryDb.auth(req, res);
});

module.exports = router;

