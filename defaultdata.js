var async = require('async');
var executeQuery = require('./lib/db.js');

var universityName = 'T.E.I Thess';
var departmentName = 'T.P.T.';

var secretaryName = 'tpt-secretary';
var secretaryPassword = '1234567890';
var secretaryDepartment = 1;

function createUniversity(cb) {
    var sqlQuery = 'SELECT university_create($1);';

    executeQuery(sqlQuery, [universityName], function(err) {
        var error = null;
        if (err !== null) {
            error = err;
        }
        cb(error, 'ok');
    });
}

function createDepartment(cb) {
    var sqlQuery = 'SELECT department_create($1, $2);';

    executeQuery(sqlQuery, [departmentName, 1], function(err) {
        var error = null;
        if (err !== null) {
            error = err;
        }
        cb(error, 'ok');
    });
}

function createSecretary(cb) {
    var sqlQuery = 'SELECT secretary_create($1, $2, $3);';

    executeQuery(sqlQuery, [secretaryName, secretaryPassword, secretaryDepartment], function(err) {
        var error = null;
        if (err !== null) {
            error = err;
        }
        cb(error, 'ok');
    });
}

async.series([createUniversity, createDepartment, createSecretary], function(err, results){
    if (err) {
        console.log('Error' + err);
        process.exit(1);
    }

    console.log('University: ' + results[0]);
    console.log('Department: ' + results[1]);
    console.log('Secretary: '+ results[2]);

    process.exit(0);
});

