var testUtils = require('./testutils.js');
var should = require('should');

describe('lesson', function() {

        describe('Remove lesson', function() {

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
                        success: true
                    }
                };

                var opts = {
                    path: 'lesson/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lesson: 2
                };

                var optsCreate = {
                    path: 'lesson/create',
                    method: 'POST',
                    auth: true
                };

                optsCreate.form = {
                    name: 'Programming 2000'
                };

                testUtils.getUrl(optsCreate, function(res, body) {
                    testUtils.getUrl(opts, function(res, body) {
                        res.body.should.eql(expected)
                        done();
                    });
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
                    path: 'lesson/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lesson: 1
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
                    path: 'lesson/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    //lesson: 2
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
                path: 'lesson/remove',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                lesson: 2
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });
    });

});

