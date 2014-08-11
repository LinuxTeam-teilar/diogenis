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
            j = utils.errorJson(req, res, 'DbError');
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
            j = utils.errorJson(req, res, 'DbError');
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

module.exports.use = function(req, res) {
    var classroomId = req.body.classroomId;
    var lessonId = req.body.lessonId;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var day = req.body.day;

    var j = {};

    if (!classroomId || !lessonId || !startTime || !endTime || !day) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT classroom_add_lesson($1, $2, $3, $4, $5);";
    executeQuery(sqlQuery, [classroomId, lessonId, startTime, endTime, day], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            var resultCode = results[0].classroom_add_lesson;

            if (resultCode >= 1 && resultCode <= 5) {
                j = utils.errorJson(req, res, 'NotExist');
            } else if (resultCode == 6) {
                j = utils.errorJson(req, res, 'ClassroomAlreadyUsed');
            } else if (resultCode == 0) {
                j.classroomSchedule = {
                    classroom: classroomId,
                    lesson: lessonId,
                    "startTime": startTime,
                    "endTime": endTime,
                    "day": day
                };
            } else {
                j = utils.errorJson(req, res, 'DbError');
            }
        }

        res.json(j);
    });
};

