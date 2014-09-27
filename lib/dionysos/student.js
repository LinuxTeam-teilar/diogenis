var cheerio = require('cheerio');
var request = require('request');
var debug = require('debug')('dionysos');
var exec = require('child_process').exec;
var executeQuery = require('../db.js');

function findCredentials($, cb) {
    var departmentHTML = $.html();
    var credentials = $('table.tableheader').html();
    cheerio.load(credentials);
    var studentAm = $('#subheader').text();
    var studentName = $('.tableheader#header').text();

    cheerio.load(departmentHTML)
    $ = cheerio.load($('td#main > div').last().html());
    $ = cheerio.load($('table > tr').eq(8).html());

    // it should be  Τμήμα:
    var departmentLabel = $('td').first().text();
    //it should be something like ΤΜΗΜΑ ΜΗΧΑΝΙΚΩΝ ΠΛΗΡΟΦΟΡΙΚΗΣ ΤΕ
    var departmentValue = $('td').last().text();

    //don't remove the spaces. They are correct
    //console.log(departmentLabel === 'Τμήμα: ')
    //console.log(departmentLabel)
    //console.log(departmentValue)
    //console.log(departmentValue === ' ΤΜΗΜΑ ΜΗΧΑΝΙΚΩΝ ΠΛΗΡΟΦΟΡΙΚΗΣ ΤΕ')

    departmentValue = departmentValue.trim();

    var student = {
        name: studentName,
        am: studentAm,
        departmentId: -1
    };

    var sqlQuery = "SELECT id FROM department WHERE name LIKE $1";
    executeQuery(sqlQuery, [departmentValue], function(err, results) {
        var emptyStudent = {};
        if (err !== null) {
            console.log("DbError in Dionysos:", err)
            cb({});
        } else {
            if (results.length == 0) {
                cb({});
                console.log("Department doesn't exist");
                console.log(student);
                console.log(departmentValue)
                return;
            }

            student.departmentId = results[0].id;
            cb(student);
        }
    });
};

module.exports.login = function(username, password, cb) {
    var command = './tmp/bin/dionysos --username=' + username + ' --password=' + password;
    exec(command , function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
            console.log(stderr);
            cb({});
        }

        try {
            $ = cheerio.load(stdout);
            findCredentials($, cb);
        } catch(e) {
            console.log("Exception in Dionysos", e)
        }
    });
};

