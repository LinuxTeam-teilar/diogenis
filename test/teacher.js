/*
Copyright 2014 Antonis Tsiapaliokas <antonis.tsiapaliokas@kde.org>
Copyright 2014 Giorgos Tsiapaliokas <giorgos.tsiapaliokas@kde.org>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 2 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var testUtils = require('./testutils.js');
var should = require('should');

describe('Teacher', function() {

    describe('Create Teacher', function() {

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
                    user: {
                        email: 'superteacher@teilar.gr',
                        name: 'Super Teacher'
                    }
                };

                var opts = {
                    path: 'teacher/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Super Teacher',
                    password: 'superteacher',
                    email: 'superteacher@teilar.gr'
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
                    path: 'teacher/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Super Teacher',
                    password: 'superteacher'//,
                    //email: 'superteacher@teilar.gr'
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
                path: 'teacher/create',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                name: 'Super Teacher',
                password: 'superteacher',
                email: 'superteacher@teilar.gr'
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });


   describe('Auth Teacher', function() {
        it('should succeed', function(done) {
            var expected = {
                error: {
                    name: '',
                    id: -1
                },
                auth: {
                    success: true
                },
                user: {
                    username: 'superteacher@teilar.gr',
                    id: 1
                }
            };

            testUtils.authTeacher(function(res) {
                res.body.should.eql(expected);
                done();
            });

        });

        it('should fail', function(done) {
            var expected = {
                error: {
                    name: 'AuthorizationFailed',
                    id: 1
                },
                auth: {
                    success: false
                }
            };

            var opts = {
                path: 'teacher/auth',
                method: 'POST'
            };

            opts.form = {
                username: 'fail',
                password: 'fail',
            };

            testUtils.getUrl(opts, function(res, body) {
               res.body.should.eql(expected);
               done();
            });

        });

        it('Invalid Parameters', function(done) {
            var expected = {
                error: {
                    name: 'InvalidParameters',
                    id: 3
                },
                auth: {
                    success: false
                }
            };

            var opts = {
                path: 'teacher/auth',
                method: 'POST'
            };

            opts.form = {
                username: 'fail'
                //password: 'fail',
            };

            testUtils.getUrl(opts, function(res, body) {
               res.body.should.eql(expected);
               done();
            });

        });

    });
    describe('List all', function() {})

});

