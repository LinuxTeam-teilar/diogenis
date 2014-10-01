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

describe('teacher', function() {

        describe('Remove teacher', function() {

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
                    path: 'teacher/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    teacher: 2
                };

                var optsCreate = {
                    path: 'teacher/create',
                    method: 'POST',
                    auth: true
                };

                optsCreate.form = {
                    name: 'Test Teacher',
                    password: 'testteacher',
                    email: 'testteacher@teilar.gr'
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
                    path: 'teacher/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    teacher: 2
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
                    path: 'teacher/remove',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    //teacher: 2
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
                path: 'teacher/remove',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
               //teacher: 2
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });
    });

});

