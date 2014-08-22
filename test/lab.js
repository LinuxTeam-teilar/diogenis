var testUtils = require('./testutils.js');
var should = require('should');

describe('lab', function() {

    describe('Create lab', function() {

        it('Should succeed', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: -1,
                        name: ''
                    },
                    lab: {
                        teacher: 1,
                        recordspresence: false,
                        lesson :1,
                        limit: 25,
                        classroom: 1,
                        startTime: 8,
                        endTime: 10,
                        day: 1
                    }
                };

                var opts = {
                    path: 'lab/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    teacher: 1,
                    recordspresence: false,
                    lesson :1,
                    limit: 25,
                    classroom: 1,
                    starttime: 8,
                    endtime: 10,
                    day: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });

        it('Should Fail', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: 10,
                        name: 'ClassroomAlreadyUsed'
                    }
                };

                var opts = {
                    path: 'lab/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    teacher: 1,
                    recordspresence: false,
                    lesson :1,
                    limit: 25,
                    classroom: 1,
                    starttime: 8,
                    endtime: 10,
                    day: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });


        it('Invalid Parameters', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
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
                    path: 'lab/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Programming 1',
                    teacher: 1,
                    department: 1
                    //limit: 25
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
                path: 'lab/create',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                name: 'Programming 1',
                teacher: 1,
                department: 1,
                limit: 25
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

    describe('List All labs', function() {

        it('Should succeed', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {
                    "auth": {
                        "success": true
                    },
                    "error": {
                        "id": -1,
                        "name": ""
                    },
                    "labs": [
                        {
                            classroomid: 1,
                            classroomname: "new_unix",
                            day: 1,
                            labid: 1,
                            lablimit: 25,
                            lessonid: 1,
                            lessonname: "Programming 1",
                            recordspresence: false,
                            teacheremail: "superteacher@teilar.gr",
                            teacherid: 1,
                            teachername: "Super Teacher",
                            timeend: 10,
                            timestart: 8
                        }
                    ]
                };

                var opts = {
                    path: 'lab/list',
                    auth: true
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });
    });

    describe('Add student', function() {

        it('Should succeed', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: -1,
                        name: ''
                    },
                    labAttributes: {
                        lab: 1,
                        student: 1,
                        isstudentinqueue: false
                    }
                };

                var opts = {
                    path: 'lab/add/student',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 1,
                    studentId: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });

       it('Should Fail', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: 9,
                        name: 'DbError'
                    }
                };

                var opts = {
                    path: 'lab/add/student',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 1000000000,
                    studentId: 100000000
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });


        it('Invalid Parameters', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
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
                    path: 'lab/add/student',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 1
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
                path: 'lab/add/student',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                labId: 1,
                studentId: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

    describe('Remove student', function() {

        it('Should succeed', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: -1,
                        name: ''
                    },
                    operation: {
                        lab: 1,
                        student: 1,
                        status: true
                    }
                };

                var opts = {
                    path: 'lab/remove/student',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 1,
                    studentId: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });

       it('Should Fail', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: 8,
                        name: 'DeletionFailed'
                    }
                };

                var opts = {
                    path: 'lab/remove/student',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 1000000000,
                    studentId: 100000000
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });


        it('Invalid Parameters', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
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
                    path: 'lab/remove/student',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 1
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
                path: 'lab/remove/student',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                labId: 1,
                studentId: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });


});

