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

