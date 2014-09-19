#!/usr/bin/env bash

./node_modules/.bin/mocha -t 100000 --reporter $1 test/teacher.js \
                                                  test/student.js \
                                                  test/secretary.js \
                                                  test/lesson.js \
                                                  test/classroom.js \
                                                  test/lab.js \
                                                  test/teacher_list.js \
                                                  test/student_list.js \
                                                  test/classroom_remove.js \
                                                  test/lesson_remove.js \
                                                  test/lab_remove.js \
                                                  test/student_remove.js

