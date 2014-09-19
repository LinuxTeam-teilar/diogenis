var testUtils = require('./testutils.js');
var should = require('should');

describe('classroom', function() {

        describe('Remove classroom', function() {

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
                    path: 'classroom/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    classroom: 2
                };

                var optsCreate = {
                    path: 'classroom/create',
                    method: 'POST',
                    auth: true
                };

                optsCreate.form = {
                    name: 'Nt'
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
                    path: 'classroom/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    classroom: 1
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
                    path: 'classroom/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    //classroom: 2
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
                path: 'classroom/remove',
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

});

