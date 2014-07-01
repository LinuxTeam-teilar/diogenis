var express = require('express');
var router = express.Router();

var universityDb = require('../lib/db/university.js');

router.get('/create', function(req, res) {
    var universityName = req.query.name;

    var j = {
        ok: true,
        name: ""
    };

    if (!universityName) {
        j.ok = false;
        res.json(j);
    }

    universityDb.create(function(success) {
        if (success) {
            j.name = universityName;
            res.json(j);
        }

    }, universityName);
});

module.exports = router;

