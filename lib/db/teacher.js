/*
Copyright 2014 Antonis Tsiapaliokas <antonis.tsiapaliokas@kde.org>
Copyright 2014 Giorgos Tsiapaliokas <giorgos.tsiapaliokas@kde.org>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 2 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var executeQuery = require('../db.js');
var utils = require('../utils.js');
var fs = require('fs');

module.exports.create = function(req, res) {
    var teacherName = req.body.name;
    var teacherPassword = req.body.password;
    var teacherEmail = req.body.email;
    var departmentId = req.session.departmentId;

    var j = {};

    if (!teacherName || !teacherPassword || !teacherEmail) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT teacher_create($1, $2, $3, $4);";
    executeQuery(sqlQuery, [teacherName, teacherEmail, teacherPassword, departmentId], function(err, results) {
        if (err === null && results[0].teacher_create) {
            j = utils.standardJson(req, res);
            j.user = {
                name: teacherName,
                email: teacherEmail
            };
        } else {
            j = utils.errorJson(req, res, 'CreationFailed');
        }

        res.json(j)
    });
};

module.exports.auth = function(req, res) {
    var teacherUsername = req.body.username;
    var teacherPassword = req.body.password;

    var j = {};

    if (!teacherUsername || !teacherPassword) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT success, departmentId, teacherId FROM teacher_auth($1, $2);";
    executeQuery(sqlQuery, [teacherUsername, teacherPassword], function(err, results) {
        if (err === null && results[0].success) {
            utils.clearSession(req);
            req.session.isTeacher = true;
            req.session.departmentId = results[0].departmentid;
            req.session.teacherId = results[0].teacherid;

            j = utils.standardJson(req, res);
            j.user = {
                id: results[0].teacherid,
                username: teacherUsername
            };
        } else {
            j = utils.errorJson(req, res, 'AuthorizationFailed');
        }

        res.json(j)
    });
};

module.exports.listAll = function(req, res) {
    var departmentId = req.session.departmentId;

    var sqlQuery = "SELECT teacher_list_all($1);";
    executeQuery(sqlQuery, [departmentId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            j = utils.standardJson(req, res);
            j.teachers = {};
            j.teachers = results[0].teacher_list_all
        }

        res.json(j)
    });
};

module.exports.listStudents = function(req, res) {
    var j = {};

    var teacherId = req.session.teacherId;

    var sqlQuery = fs.readFileSync(process.cwd() +
                                   '/db/queries/teacher_list_students.sql').toString();

    executeQuery(sqlQuery, [teacherId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
            res.json(j);
        } else {
            j = utils.standardJson(req, res);
            if ( results.lenght === 0) {
                j.teacher = {};
            } else {
              var results_ok = JSON.parse(JSON.stringify(results));
              results_ok[0].labs = [];
              for(var key in results[0].labs) {
                //TODO make it better i guess?!!!!
                //Stay away from here. You have been warned!!!
                //ugly hack. Touch only if you understand the above code,
                //otherwise your cat will die badly...
                //This code removes the left overs from our json.
                //Left overs = labs for other teachers,
                //multiple students in the same lab.
                var lab = results[0].labs[key]
                if (lab.teacher == req.session.teacherId ) {
                  var students_ok = JSON.parse(JSON.stringify(lab.students))
                  lab.students = []
                  for (var s in students_ok) {
                    var student = students_ok[s]
                    if (student.lab == lab.id) {
                      lab.students.push(student)
                    }
                  }
                  results_ok[0].labs.push(lab)
                }
              }
              j.teacher = results_ok[0]
            }
            res.json(j);
        }
    });
};

module.exports.remove = function(req, res) {
    var teacherId = req.body.teacher;

    var j = {};

    if (!teacherId) {
        j = utils.errorJson(req, res, 'InvalidParameters');
        res.json(j);
        return;
    }

    var sqlQuery = "SELECT teacher_remove($1);";
    executeQuery(sqlQuery, [teacherId], function(err, results) {
        if (err !== null) {
            j = utils.errorJson(req, res, 'DbError');
        } else {
            var status = results[0].teacher_remove;
            if (status) {
                j = utils.standardJson(req, res);
                j.operation = {
                    success: status
                };
            } else {
                j = utils.errorJson(req, res, 'DeletionFailed');
            }
        }
        res.json(j);
    });
};

