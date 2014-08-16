var testUtils = require('./testutils.js');
var should = require('should');

describe('Lesson', function() {

    describe('Create Lesson', function() {

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
                    lesson: {
                        id: 2,
                        name: 'Programming 4',
                        teacher: 1,
                        department: 1,
                        recordspresence: false,
                        lessonlimit: 25
                    }
                };

                testUtils.createLesson('Programming 4', function(res) {
                    res.body.should.eql(expected);
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
                        id: 4,
                        name: 'CreationFailed'
                    }
                };

                testUtils.createLesson('Programming 4', function(res) {
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
                    path: 'lesson/create',
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
                path: 'lesson/create',
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

    describe('Records Presence', function() {
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
                    lesson: {
                        id: 1,
                        name: 'Programming 1',
                        teacher: 1,
                        department: 1,
                        recordspresence: true,
                        lessonlimit: 25
                    }
                };

                var opts = {
                    path: 'lesson/recordsPresence',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Programming 1',
                    recordsPresence: true
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
                    path: 'lesson/recordsPresence',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Programming 1'
                    //recordsPresence: true
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
                path: 'lesson/recordsPresence',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                name: 'Programming 1',
                recordsPresence: true
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

    describe('List All Lessons', function() {

        it('Should succeed', function(done) {
            var expected = {
                "auth": {
                    "success": false
                },
                "error": {
                    "id": -1,
                    "name": ""
                },
                "lessons": [{
                    "department": 1,
                    "id": 2,
                    "name": "Programming 4",
                    "recordspresence": false,
                    "teacher": 1,
                    "lessonlimit": 25
                },
                {
                    "department": 1,
                    "id": 1,
                    "name": "Programming 1",
                    "recordspresence": true,
                    "teacher": 1,
                    "lessonlimit": 25
                }]
            };

            var opts = {
                path: 'lesson/list/1',
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

        it('Invalid Parameters', function(done) {
            var opts = {
                path: 'lesson/list',
                statusCode: 404
            };

            testUtils.getUrl(opts, function(res, body) {
                done();
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
                    lessonAttributes: {
                        lesson: 1,
                        student: 1,
                        isstudentinqueue: false
                    }
                };

                var opts = {
                    path: 'lesson/add/student',
                    method: 'POST',
                    auth: true
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
                    path: 'lesson/add/student',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lessonId: 1000000000,
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
                    path: 'lesson/add/student',
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
                path: 'lesson/add/student',
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
                        lesson: 1,
                        student: 1,
                        status: true
                    }
                };

                var opts = {
                    path: 'lesson/remove/student',
                    method: 'POST',
                    auth: true
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
                    path: 'lesson/remove/student',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lessonId: 1000000000,
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
                    path: 'lesson/remove/student',
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
                path: 'lesson/remove/student',
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

