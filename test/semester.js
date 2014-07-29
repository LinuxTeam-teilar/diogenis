var testUtils = require('./testutils.js');
var should = require('should');

describe('Semester', function() {

    describe('Create Semester', function() {

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
                    semester: {
                        id: 1,
                        name: '2014X-2015E'
                    }
                };

                var opts = {
                    path: 'semester/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: '2014X-2015E'
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
                    path: 'semester/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: '2014X-2015E'
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
                    path: 'semester/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    //name: '2014X-2015E'
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
                path: 'semester/create',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                name: '2014X-2015E'
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

    describe('Add Lesson', function() {

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
                    semesterAttributes: {
                        lesson: {
                            department: 1,
                            id: 1,
                            name: 'Programming 1',
                            recordspresence: true,
                            teacher: 1
                        },
                        semester: {
                            id: 1,
                            name: "2014X-2015E"
                        }
                    }
                };

                var opts = {
                    path: 'semester/lesson/add',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lesson: 1,
                    semester: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });

        it('Already Exists', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: 6,
                        name: 'AlreadyExists'
                    }
                };

                var opts = {
                    path: 'semester/lesson/add',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lesson: 1,
                    semester: 1
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
                    path: 'semester/lesson/add',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lesson: 1
                    // semesterId: 1
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
                path: 'semester/lesson/add',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                lesson: 1,
                semester: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

    describe('Remove Lesson', function() {

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
                    semesterAttributes: {
                        lesson: {
                            department: 1,
                            id: 1,
                            name: 'Programming 1',
                            recordspresence: true,
                            teacher: 1
                        },
                        semester: {
                            id: 1,
                            name: "2014X-2015E"
                        }
                    }
                };

                var opts = {
                    path: 'semester/lesson/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lesson: 1,
                    semester: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });

        it('Already Deleted', function(done) {
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
                    path: 'semester/lesson/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lesson: 1,
                    semester: 1
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
                    path: 'semester/lesson/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lesson: 1
                    // semesterId: 1
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
                path: 'semester/lesson/remove',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                lesson: 1,
                semester: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });
});

