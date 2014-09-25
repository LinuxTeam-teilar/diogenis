var testUtils = require('./testutils.js');
var should = require('should');

describe('Secretary', function() {

    describe('Auth Secretary', function() {
        it('Should succeed', function(done) {
            var expected = {
                error: {
                    name: '',
                    id: -1
                },
                auth: {
                    success: true,
                },
                user: {
                    username: 'tpt-secretary',
                    email: '',
                    departmentId: 1
                }
            };

            function verifyTest(res) {
                res.body.should.eql(expected)
                done();
            }

            testUtils.authSecretary(verifyTest);
        });

        it('Should fail', function(done) {
            var expected = {
                error: {
                    name: 'AuthorizationFailed',
                    id: 1
                },
                auth: {
                    success: false
                }
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


        it('Invalid Parameters', function(done) {
            var expected = {
                error: {
                    name: 'InvalidParameters',
                    id: 3
                },
                auth: {
                    success: false
                }
            };

            var opts = {
                path: 'secretary/auth',
                method: 'POST'
            };

            opts.form = {
                username: 'fail'//,
                //password: 'fail'
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });
});

