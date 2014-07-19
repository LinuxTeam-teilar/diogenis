var testUtils = require('./testutils.js');
var should = require('should');

describe('Secretary', function() {

    describe('Auth Secretary', function() {
        it('Should succeed', function(done) {
            var expected = {
                error: '',
                auth: {
                    success: true,
                    isSecretary: true,
                    username: "tpt-secretary"
                }
            };

            var opts = {
                path: 'secretary/auth',
                method: 'POST'
            };

            opts.form = {
                username: 'tpt-secretary',
                password: '1234567890'
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

        it('Should fail', function(done) {
            var expected = {
                error: 'Auth Failed'
            };

            var opts = {
                path: 'secretary/auth',
                method: 'POST'
            };

            opts.form = {
                username: 'fail',
                password: 'fail'
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });
    });
});

