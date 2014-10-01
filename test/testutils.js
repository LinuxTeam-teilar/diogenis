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

var request = require('request');
var ini = require('ini');
var fs = require('fs')

var config = ini.parse(fs.readFileSync(process.cwd() + '/diogenis.conf', 'utf-8'));
var testConfig = ini.parse(fs.readFileSync(process.cwd() + '/test/test_passwords.conf', 'utf-8'));

var cookie = '';

module.exports.authSecretary = function(cb) {
    var opts = {
        path: 'secretary/auth',
        method: 'POST'
    };

    opts.form = {
        username: 'tpt-secretary',
        password: '1234567890'
    };

    getUrl(opts, function(res, body) {
        cookie = res.headers['set-cookie'];

        if (cb) {
            cb(res);
        }
    });
};

module.exports.authTeacher = function(cb) {
    var opts = {
        path: 'teacher/auth',
        method: 'POST'
    };

    opts.form = {
        username: 'superteacher@teilar.gr',
        password: 'superteacher',
    };

    getUrl(opts, function(res, body) {
        cookie = res.headers['set-cookie'];

        if (cb) {
            cb(res);
        }
    });
};

module.exports.authStudent = function(cb) {
    var opts = {
        path: 'student/auth',
        method: 'POST'
    };

    opts.form = {
        username: testConfig.dionysos.username,
        password: testConfig.dionysos.password
    };

    getUrl(opts, function(res, body) {
        cookie = res.headers['set-cookie'];

        if (cb) {
            cb(res);
        }
    });
}

function getUrl(opts, cb) {
    var options = {
        url: 'http://' + config.server.server_host + ':' + config.server.server_port,
        method: opts.method ? opts.method : 'GET',
        headers: {
            'Cookie': opts.auth ? cookie : null
        }
    };

    options.url += '/' + opts.path;

    if (opts.qs) {
        options.qs = opts.qs;
    } else if (opts.form) {
        options.form = opts.form;
    }

    request(options, function (error, response, body) {
        if (!error) {

            if (opts.statusCode) {
                response.statusCode.should.equal(opts.statusCode);
            } else {
                response.statusCode.should.equal(200);
            }

            try {
                response.body = JSON.parse(response.body);
            } catch (e) {
                console.log('\n');
                console.log('Exception:');
                console.log(e);
                console.log('\n');
            }
            cb(response, body);
        } else {
            console.log('Error in request!!!');
            console.error(error);
            console.log('End error');
            error.should.equal(null);
        }
    });
}

module.exports.dionysosCredentials = function() {
    return testConfig.dionysos;
};

module.exports.getUrl = getUrl;

