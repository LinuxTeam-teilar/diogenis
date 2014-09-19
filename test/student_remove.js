var testUtils = require('./testutils.js');
var should = require('should');

describe('Student', function() {

    describe('Remove lab', function() {

        it('Should Fail', function(done) {
            testUtils.authStudent(function(studentRes) {
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
                    path: 'student/remove/lab',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lab: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });


        it('Invalid Parameters', function(done) {
            testUtils.authStudent(function(studentRes) {
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
                    path: 'student/remove/lab',
                    method: 'POST',
                    auth: true
                };

                opts.form = {};

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
                path: 'student/remove/lab',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                lab: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });
    });

});

