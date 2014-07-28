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
                        id: 1,
                        name: 'Programming 1',
                        teacher: 1,
                        department: 1,
                        recordsPresence: false
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
                    path: 'lesson/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Programming 1',
                    teacher: 1,
                    department: 1
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
                    path: 'lesson/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Programming 1',
                    teacher: 1
                    //department: 1
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
                department: 1
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
                        recordsPresence: true
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
                    "id": 1,
                    "name": "Programming 1",
                    "recordspresence": true,
                    "teacher": 1
                }]
            };

            var opts = {
                path: 'lesson/list',
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });
});

