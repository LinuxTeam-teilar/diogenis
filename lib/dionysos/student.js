var cheerio = require('cheerio');
var iconvlite = require('iconv-lite');
var request = require('request');
var debug = require('debug')('dionysos');

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
    var options = {
        url:'https://dionysos.teilar.gr/unistudent/',
        jar: true,
        method: 'POST',
        form: {
            userName: username,
            pwd: password,
            loginTrue: 'login',
            submit1: '%C5%DF%F3%EF%E4%EF%F2'
        }
    };

    request(options, function(error, response, body) {
        debug('Status Code: ' + response.statusCode);

        if (error) {
            debug('Error: ' + error);
            cb({});
            return;
        }

        var opts = {
            url:'https://dionysos.teilar.gr/unistudent/studentMain.asp',
            jar: true,
            encoding: null,
        };

        request(opts, function(err, res, data) {
            debug('Status Code: ' + res.statusCode);

            if (err) {
                debug('Error: ' + err);
                cb({});
                return;
            }

            try {
                var buffer = iconvlite.decode(data, "windows-1253");
                debug(buffer);
                $ = cheerio.load(buffer);
                var student = findCredentials($);
                debug(student);
                cb(student);
            } catch(e) {
                debug('Dionysos failed!!!!!!');
                debug('Exception: ' + e);
                cb({});
            }
        });
    });
};

