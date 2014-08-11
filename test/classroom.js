var testUtils = require('./testutils.js');
var should = require('should');

describe('classroom', function() {

    describe('Create classroom', function() {

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
                    classroom: {
                        id: 1,
                        name: 'Unix'
                    }
                };

                var opts = {
                    path: 'classroom/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Unix'
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
                        id: 4,
                        name: 'CreationFailed'
                    }
                };

                var opts = {
                    path: 'classroom/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Unix'
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
                    path: 'classroom/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    //name: 'Unix'
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
                path: 'classroom/create',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                name: 'NT'
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

    describe('Rename classroom', function() {

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
                    classroom: {
                        id: 1,
                        name: 'new_unix'
                    }
                };

                var opts = {
                    path: 'classroom/rename',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    id: 1,
                    name: 'new_unix'
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
                        id: 5,
                        name: 'UpdateFailed'
                    }
                };

                var opts = {
                    path: 'classroom/rename',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    id: 22222222,
                    name: 'invalid'
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
                    path: 'classroom/rename',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    id: 1
                    //name: 'new_unix'
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
                path: 'classroom/rename',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                id: 1,
                name: 'new_unix'
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

    describe('Use classroom', function() {

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
                    classroomSchedule: {
                        classroom: 1,
                        lesson: 1,
                        startTime: 8,
                        endTime: 10,
                        day: 1
                    }
                };

                var opts = {
                    path: 'classroom/use',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    classroomId: 1,
                    lessonId: 1,
                    startTime: 8,
                    endTime: 10,
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
                    path: 'classroom/use',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    classroomId: 1,
                    lessonId: 1,
                    startTime: 8,
                    endTime: 10,
                    day: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });

        it('NotExist', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: 7,
                        name: 'NotExist'
                    }
                };

                var opts = {
                    path: 'classroom/use',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    classroomId: 10000,
                    lessonId: 10000,
                    startTime: 800000,
                    endTime: 100000,
                    day: 100000
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
                    path: 'classroom/use',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    classroomId: 1,
                    lessonId: 1,
                    startTime: 8,
                    endTime: 10
                    //day: 1
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
                path: 'classroom/use',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                classroomId: 1,
                lessonId: 1,
                startTime: 8,
                endTime: 10,
                day: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

});

