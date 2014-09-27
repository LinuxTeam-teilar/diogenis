var cheerio = require('cheerio');
var request = require('request');
var debug = require('debug')('dionysos');
var exec = require('child_process').exec;

function findCredentials($) {
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
    var student = {
        name: studentName,
        am: studentAm,
        departmentName: departmentValue
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

        var student = {
            name: '',
            am: ''
        };

        try {
            $ = cheerio.load(stdout);
            var student = findCredentials($);
        } catch(e) {
            console.log("Exception in Dionysos", e)
        }

        debug(student);
        cb(student);

    });
};

