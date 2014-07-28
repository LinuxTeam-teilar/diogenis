#!/usr/bin/env bash

./node_modules/.bin/mocha --reporter $1 test/secretary.js \
                                        test/teacher.js \
                                        test/lesson.js \
                                        test/semester.js

