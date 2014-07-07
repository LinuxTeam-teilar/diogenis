var testUtils = require('./testutils.js');

describe('University', function() {

    describe('Create New University', function() {
        it('Should succeed', function(done) {
            var opts = {
                path: 'university/create'
            };

            opts.qs = {
                name: 'TEI thess'
            };

            testUtils.getUrl(opts, function(res, body) {
                done();
            });
        });
    });

});

