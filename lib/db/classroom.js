var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var classroomName = req.body.name;

    var j = {};

    if (!classroomName) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT classroom_create($1);";
    executeQuery(sqlQuery, [classroomName], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.classroom = results[0].classroom_create;
            if (j.classroom.name != classroomName) {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }

        res.json(j);
    });
};

module.exports.rename = function(req, res) {
    var newClassroomName = req.body.name;
    var classroomId = req.body.id;

    var j = {};

    if (!newClassroomName || !classroomId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT classroom_change_name($1, $2);";
    executeQuery(sqlQuery, [classroomId, newClassroomName], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'UpdateFailed');
        } else {
            j = utils.standardJson(req, res);
            j.classroom = results[0].classroom_change_name;
            if (j.classroom.name != newClassroomName ||
                j.classroom.id != classroomId) {
                j = utils.errorJson(req, res, 'UpdateFailed');
            }
        }

        res.json(j);
    });
};
