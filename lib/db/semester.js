var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var semesterName = req.body.name;

    var j = {};

    if (!semesterName) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT semester_create($1);";
    executeQuery(sqlQuery, [semesterName], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.semester = results[0].semester_create;
            if (j.semester.name != semesterName ) {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }

        res.json(j);
    });
};

