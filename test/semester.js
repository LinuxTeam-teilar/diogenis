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

});

