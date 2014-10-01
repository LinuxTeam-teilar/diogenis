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

describe('Lesson', function() {

    describe('Create Lesson', function() {

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
                    lesson: {
                        id: 1,
                        name: 'Programming 1',
                        department: 1
                    }
                };


                var opts = {
                    path: 'lesson/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Programming 1',
                    department: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected);
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
                    path: 'lesson/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Programming 1',
                    department: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected);
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
                    path: 'lesson/create',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    name: 'Programming 1'
                    //department: 1
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected);
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
                path: 'lesson/create',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                name: 'Programming 1',
                department: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });

    });

    describe('Add teacher', function() {
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
                    lesson: {
                        lesson: 1,
                        teacher: 1
                    }
                };

                var opts = {
                    path: 'lesson/add/teacher',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lesson: 1,
                    teacher: 1
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
                    path: 'lesson/add/teacher',
                    method: 'POST',
                    auth: true
                };

                opts.form = {
                    lesson: 1
                    //teacher: 1
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
                path: 'lesson/add/teacher',
                method: 'POST',
                statusCode: 401
            };

            opts.form = {
                lesson: 1,
                teacher: 1
            };

            testUtils.getUrl(opts, function(res, body) {
                res.body.should.eql(expected)
                done();
            });
        });


    });

    describe('List All Lessons', function() {

        it('Should succeed', function(done) {
            testUtils.authSecretary(function(secretaryRes) {
                var expected = {
                    auth: {
                        success: true
                    },
                    error: {
                        id: -1,
                        name: ""
                    },
                    lessons: [
                        {
                            id: 1,
                            name: "Programming 1",
                            teachers: [{
                                email: "superteacher@teilar.gr",
                                id: 1,
                                name: "Super Teacher",
                                department: 1
                            }]
                        }
                    ]
                };

                var opts = {
                    path: 'lesson/list',
                    auth: true
                };

                testUtils.getUrl(opts, function(res, body) {
                    res.body.should.eql(expected)
                    done();
                });
            });
        });
    });

});

