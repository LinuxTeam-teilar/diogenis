var request = require('request');
var ini = require('ini');
var fs = require('fs')

var config = ini.parse(fs.readFileSync(process.cwd() + '/diogenis.conf', 'utf-8'));

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

            response.body = JSON.parse(response.body)
            cb(response, body);
        } else {
            console.log('Error in request!!!');
            console.error(error);
            console.log('End error');
            error.should.equal(null);
        }
    });
}

module.exports.getUrl = getUrl;
