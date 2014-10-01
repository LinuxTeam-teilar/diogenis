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

var pg = require('pg');
var ini = require('ini');
var fs = require('fs')

var config = ini.parse(fs.readFileSync(process.cwd() + '/diogenis.conf', 'utf-8'));
var databaseName = config.database.database_name;
var databaseUser = config.database.database_user;

var connectionString = 'postgres://' + databaseUser + '@localhost/' + databaseName;


function checkResult(error, result, done, func) {
    done();

    var err = null;

    var resultRows = [];
    if(error) {
        console.error('error running query:', error);
        err = error;
    } else {
        resultRows = result.rows;
    }

    func(err, resultRows);
}

module.exports = function(sqlQuery, queryArguments, func) {
    if (!sqlQuery) {
        return null;
    }

    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool', err);
            return null;
        }

        if (queryArguments.length > 0) {
            client.query(sqlQuery, queryArguments, function(error, result) {
                checkResult(error, result, done, func);
            });
        } else {
            client.query(sqlQuery, function(error, result) {
                checkResult(error, result, done, func);
            });
        }
    });
};

