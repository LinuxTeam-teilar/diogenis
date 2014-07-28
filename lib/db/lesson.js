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

            var lessonResults = JSON.parse(results[0].lesson_create);
            var lessonId = lessonResults.id;
            var resultName = lessonResults.name;
            var resultTeacher = lessonResults.teacher;
            var resultDepartment = lessonResults.department;

            if (resultName == lessonName && resultTeacher == teacher &&
               resultDepartment == department) {
                j = utils.standardJson(req, res);
                j.lesson = {
                    name: resultName,
                    teacher: resultTeacher,
                    department: resultDepartment
                };
            } else {
                j = utils.errorJson(req, res, 'CreationFailed');
            }
        }

        res.json(j)
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
            var lessonResults = JSON.parse(results[0].lesson_records_presence);
            var lessonId = lessonResults.id;
            var resultName = lessonResults.name;
            var resultTeacher = lessonResults.teacher;
            var resultDepartment = lessonResults.department;
            var resultRecordsPresence = lessonResults.recordspresence;
            if (recordsPresence == resultRecordsPresence) {
                j = utils.standardJson(req, res);
                j.lesson = {
                    id: lessonId,
                    name: resultName,
                    teacher: resultTeacher,
                    department: resultDepartment,
                    recordsPresence: resultRecordsPresence
                };
            } else {
                j = utils.errorJson(req, res, 'UpdateFailed');
            }
        }

        res.json(j)
    });
};

