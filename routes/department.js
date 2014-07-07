var express = require('express');
var router = express.Router();

var departmentDb = require('../lib/db/department.js');

router.get('/create', function(req, res) {
    departmentDb.create(req, res);
});

module.exports = router;

