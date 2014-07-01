var express = require('express');
var router = express.Router();

var departmentDb = require('../lib/db/department.js');

router.get('/create', function(req, res) {
    var departmentName = req.query.name;
    var universityId = req.query.universityId;

    var j = {
        ok: true,
        name: "",
        universityId: -1
    };

    if (!departmentName || !universityId) {
        j.ok = false;
        res.json(j);
    }

    departmentDb.create(function(success) {
        if (success) {
            j.name = departmentName;
            j.universityId = universityId;
            res.json(j);
        }

    }, departmentName, universityId);
});

module.exports = router;

