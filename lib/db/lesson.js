var executeQuery = require('../db.js');
var utils = require('../utils.js');

module.exports.create = function(req, res) {
    var teacher = req.body.teacher;
    var department = req.body.department;
    var lessonName = req.body.name;

    var j = {};

    if (!teacher || !department || !lessonName) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lesson_create($1, $2, $3);";
    executeQuery(sqlQuery, [teacher, department, lessonName], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.lesson = results[0].lesson_create;
            if (j.lesson.name != lessonName || j.lesson.teacher != teacher ||
                j.lesson.department != department) {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }

        res.json(j);
    });
};

module.exports.recordsPresence = function(req, res) {
    var lessonName = req.body.name;
    var recordsPresence = Boolean(req.body.recordsPresence);

    var j = {};

    if (!lessonName || !recordsPresence) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lesson_records_presence($1, $2);";
    executeQuery(sqlQuery, [lessonName, recordsPresence], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.lesson = results[0].lesson_records_presence;
            if (recordsPresence != j.lesson.recordspresence) {
                j = utils.errorJson(req, res, 'UpdateFailed');
            }
        }

        res.json(j)
    });
};

module.exports.listAll = function(req, res) {
    var departmentId = req.params.departmentId;

    var j = {};

    if (!departmentId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT lesson_list_all($1);";
    executeQuery(sqlQuery, [departmentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'CreationFailed');
        } else {
            j = utils.standardJson(req, res);
            j.lessons = results[0].lesson_list_all
        }

        res.json(j)
    });
};
