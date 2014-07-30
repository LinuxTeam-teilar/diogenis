var testUtils = require('./testutils.js');
var should = require('should');
var dionysosCredentials = testUtils.dionysosCredentials();

describe('Student', function() {

    describe('Auth Student', function() {

        it('Should succeed', function(done) {
            var expected = {};

            var opts = {
                path: 'student/auth',
                method: 'POST'
            };

            opts.form = {
                username: dionysosCredentials.username,
                password: dionysosCredentials.password
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

        it('Student does not exist', function(done) {
            var expected = {
                auth: {
                    success: false
                },
                error: {
                    id: 1,
                    name: 'AuthorizationFailed'
                }
            };

            var opts = {
                path: 'student/auth',
                method: 'POST'
            };

            opts.form = {
                username: 'invalid',
                password: 'invalid'
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

        it('Invalid Parameters', function(done) {
            var expected = {
                auth: {
                    success: false
                },
                error: {
                    id: 3,
                    name: 'InvalidParameters'
                }
            };

            var opts = {
                path: 'student/auth',
                method: 'POST',
            };

            opts.form = {
                name: dionysosCredentials.username
                //password: dionysosCredentials.password
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

});

