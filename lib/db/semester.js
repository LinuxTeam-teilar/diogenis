var executeQuery = require('../db.js');
var utils = require('../utils.js');

function semesterJson(req, res, data) {
    var j = utils.standardJson(req, res);
    var semesterResults = JSON.parse(data);

    j.semester = {
        id: semesterResults.id,
        name: semesterResults.name
    };

    return j;
}

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
            j = semesterJson(req, res, results[0].semester_create);
            var semester = j.semester;
            if (semester.name != semesterName ) {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }

        res.json(j);
    });
};

