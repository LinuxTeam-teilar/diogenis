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

    describe('List all classrooms', function() {
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
                    classrooms: [
                        {
                            id: 1,
                            name: 'new_unix'
                        }
                    ]
                };

                var opts = {
                    path: 'classroom/list',
                    auth: true
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });
    })
});

