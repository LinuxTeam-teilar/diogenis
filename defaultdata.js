var async = require('async');
var executeQuery = require('./lib/db.js');

var universityName = "T.E.I Thess";
var departmentName = "T.P.T.";

function createUniversity(cb) {
    var sqlQuery = "SELECT university_create($1);";

    executeQuery(sqlQuery, [universityName], function(err) {
        var error = null;
        if (err !== null) {
            error = err;
        }
        cb(error, universityName);
    });
}

function createDepartment(cb) {
    var sqlQuery = "SELECT department_create($1, $2);";

    executeQuery(sqlQuery, [departmentName, 1], function(err) {
        var error = null;
        if (err !== null) {
            error = err;
        }
        cb(error, departmentName);
    });
}

async.series([createUniversity, createDepartment], function(err, results){
    if (err) {
        console.log("Error" + err);
        process.exit(1);
    }

    console.log("University: " + results[0]);
    console.log("Department: " + results[1]);

    process.exit(0);
});

