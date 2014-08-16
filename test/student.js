var testUtils = require('./testutils.js');
var should = require('should');
var dionysosCredentials = testUtils.dionysosCredentials();

function authStudent(done) {
    var expected = {
        "auth": {
            "success": false
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

    describe('Add record', function() {

        it('Should succeed', function(done) {
            testUtils.authTeacher(function(teacherRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: -1,
                        name: ''
                    },
                    lesson: {
                        id: 1,
                        name: 'Programming 1',
                        teacher: 1,
                        department: 1,
                        recordspresence: false,
                        lessonlimit: 25
                    }
                };

                var opts = {
                    path: 'student/add/record',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lessonId: 1,
                    studentId: 1
                };

                testUtils.createLesson('Programming 1', function(lessonRes) {
                    testUtils.getUrl(opts, function(res, body) {
                        res.body.should.eql(expected)
                        done();
                    });
                });
            });
        });

       it('Should Fail', function(done) {
            testUtils.authTeacher(function(teacherRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: 4,
                        name: 'CreationFailed'
                    }
                };

                var opts = {
                    path: 'student/add/record',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lessonId: 1000000000,
                    studentId: 1000000000
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });


        it('Invalid Parameters', function(done) {
            testUtils.authTeacher(function(teacherRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: 3,
                        name: 'InvalidParameters'
                    }
                };

                var opts = {
                    path: 'student/add/record',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lessonId: 1
                    //studentId: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });

        it('UnAuthorized Request', function(done) {
            var expected = {
                auth: {
                    success: false
                },
                error: {
                    id: 2,
                    name: 'UnAuthorized'
                }
            };

            var opts = {
                path: 'student/add/record',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                lessonId: 1,
                studentId: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

});

