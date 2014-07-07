var request = require('request');
var ini = require('ini');
var fs = require('fs')

var config = ini.parse(fs.readFileSync(process.cwd() + '/diogenis.conf', 'utf-8'));


module.exports.getUrl = function(opts, cb) {
    var options = {
        url: 'http://' + config.server.server_host + ':' + config.server.server_port,
        method: 'GET'
    };

    options.url += '/' + opts.path;

    if (opts.qs) {
        options.qs = opts.qs;
    }

    request(options, function (error, response, body) {
        if (!error) {
            response.statusCode.should.equal(200);
            cb(response, body);
        } else {
            console.log('Error in request!!!');
            console.error(error);
            console.log('End error');
            error.should.equal(null);
        }
    });
};

