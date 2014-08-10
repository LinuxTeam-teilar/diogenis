var cheerio = require('cheerio');
var request = require('request');
var debug = require('debug')('dionysos');
var exec = require('child_process').exec;

function findCredentials($) {
    var credentials = $('table.tableheader').html();
    cheerio.load(credentials);
    var studentAm = $('#subheader').text();
    var studentName = $('.tableheader#header').text();
    var student = {
        name: studentName,
        am: studentAm
    };

    return student;
};

module.exports.login = function(username, password, cb) {
    var command = './tmp/bin/dionysos --username=' + username + ' --password=' + password;
    exec(command , function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
            console.log(stderr);
            cb({});
        }

        $ = cheerio.load(stdout);
        var student = findCredentials($);
        debug(student);
        cb(student);
    });
};

