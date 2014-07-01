var pg = require('pg');
var ini = require('ini');
var fs = require('fs')

var config = ini.parse(fs.readFileSync(process.cwd() + '/diogenis.conf', 'utf-8'))
var databaseName = config.database.database_name;
var databaseUser = config.database.database_user;

var connectionString = 'postgres://' + databaseUser + '@localhost/' + databaseName;


function checkResult(error, result, done, func) {
    done();

    if(error) {
        console.error('error running query', error);
        func(false);
        return;
    }

    func(true);
}

module.exports = function(func, sqlQuery, queryArguments) {
    if (!sqlQuery) {
        return null;
    }

    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool', err);
            return null;
        }

        if (queryArguments && queryArguments.length > 0) {
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

