var executeQuery = require('../db.js');
var utils = require('../utils.js');


function lessonJson(req, res, data) {
    var j = utils.standardJson(req, res);
    var lessonResults = JSON.parse(data);

    j.lesson = {
        id: lessonResults.id,
        name: lessonResults.name,
        teacher: lessonResults.teacher,
        department: lessonResults.department,
        recordsPresence: lessonResults.recordspresence
    };

    return j;
}

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
            j = lessonJson(req, res, results[0].lesson_create);
            var lesson = j.lesson;
            if (lesson.name != lessonName || lesson.teacher != teacher ||
                lesson.department != department) {
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
            j = lessonJson(req, res, results[0].lesson_records_presence);
            var lesson = j.lesson;
            if (recordsPresence != lesson.recordsPresence) {
                j = utils.errorJson(req, res, 'UpdateFailed');
            }
        }

        res.json(j)
    });
};

