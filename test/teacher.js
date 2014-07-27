var testUtils = require('./testutils.js');
var should = require('should');

describe('Teacher', function() {

    describe('Create Teacher', function() {
        it('Should succeed', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {};

                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: -1,
                        name: ''
                    },
                    user: {
                        email: 'superteacher@teilar.gr',
                        username: 'superteacher'
                    }
                };

                var opts = {
                    path: 'teacher/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    username: 'superteacher',
                    password: 'superteacher',
                    email: 'superteacher@teilar.gr'
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });
    });

});

