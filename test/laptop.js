var testUtils = require('./testutils.js');
var should = require('should');

describe('laptop', function() {

    describe('Add laptop', function() {

        it('Should succeed', function(done) {
            testUtils.authTeacher(function(secretaryRes) {
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
                    path: 'lab/add/laptop',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 3,
                    studentId: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });

        it('Should Fail', function(done) {
            testUtils.authTeacher(function(secretaryRes) {
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
                    path: 'lab/add/laptop',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 333,
                    studentId: 111
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });


        it('Invalid Parameters', function(done) {
            testUtils.authTeacher(function(secretaryRes) {
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
                    path: 'lab/add/laptop',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 3
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
                path: 'lab/add/laptop',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
               labId: 3,
               studentId: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });
    });


    describe('Remove laptop', function() {

        it('Should succeed', function(done) {
            testUtils.authTeacher(function(secretaryRes) {
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
                    path: 'lab/remove/laptop',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 3,
                    studentId: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });

        it('Should Fail', function(done) {
            testUtils.authTeacher(function(secretaryRes) {
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
                    path: 'lab/remove/laptop',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 333,
                    studentId: 111
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });


        it('Invalid Parameters', function(done) {
            testUtils.authTeacher(function(secretaryRes) {
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
                    path: 'lab/remove/laptop',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    labId: 3
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
                path: 'lab/add/laptop',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
               labId: 3,
               studentId: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });
    });

});

