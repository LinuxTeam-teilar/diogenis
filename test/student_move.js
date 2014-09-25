var testUtils = require('./testutils.js');
var should = require('should');

describe('student', function() {

    describe('Move student', function() {

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
                    operation: {
                        success: true
                    }
                };

                var opts = {
                    path: 'student/move',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    oldLab: 1,
                    newLab: 3,
                    student: 1
                };

                var optsCreate = {
                    path: 'lab/create',
                    method: 'POST',
                    auth: true
                };

                optsCreate.form = {
                    teacher: 1,
                    recordspresence: false,
                    lesson :1,
                    limit: 27,
                    classroom: 1,
                    starttime: 10,
                    endtime: 12,
                    day: 2
                };

                testUtils.getUrl(optsCreate, function(res, body) {
                    testUtils.authStudent(function(studentRes) {

                        var optsAdd = {
                            path: 'lab/add/student',
                            method: 'POST',
                            auth: true
                        };

                        optsAdd.form = {
                            labId: 1,
                            studentId: 1
                        };

                        testUtils.getUrl(optsAdd, function(res, body) {
                            testUtils.authTeacher(function(teacherRes) {
                                testUtils.getUrl(opts, function(res, body) {
                                    res.body.should.eql(expected);
                                    done();
                                });
                            });
                        });
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
                        id: 11,
                        name: 'MoveFailed'
                    }
                };

                var opts = {
                    path: 'student/move',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    oldLab: 1000,
                    newLab: 2000,
                    student: 10000
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
                    path: 'student/move',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    oldLab: 1,
                    newLab: 2,
                    //student: 1
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
                path: 'student/move',
                method: 'POST',
                statusCode: 401
            };

             opts.form = {
                oldLab: 1,
                newLab: 2,
                student: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });
    });

});

