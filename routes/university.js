var express = require('express');
var router = express.Router();

var universityDb = require('../lib/db/university.js');

router.get('/create', function(req, res) {
    universityDb.create(req, res);
});

module.exports = router;

