var testUtils = require('./testutils.js');
var should = require('should');
var dionysosCredentials = testUtils.dionysosCredentials();

function authStudent(done) {
    var expected = {
        "auth": {
            "success": true
        },
        "error": {
            "id": -1,
            "name": ""
        },
        "student": {
            "department": 1,
            "email": null,
            "id": 1,
            "identity": dionysosCredentials.identity,
            "name": dionysosCredentials.name,
            "username": dionysosCredentials.username
        }
    };

    testUtils.authStudent(function(res) {
       res.body.should.eql(expected);
       done();
    });
}

describe('Student', function() {

    describe('Auth Student', function() {

        it('Should succeed', function(done) {
           authStudent(done);
        });

        it('Should succeed again', function(done) {
           authStudent(done);
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

