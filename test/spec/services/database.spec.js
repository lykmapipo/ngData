'use strict';

describe('$database', function() {
    var databaseProvider;

    // load the ngData module
    beforeEach(function() {
        module('ngData', function($databaseProvider) {
            databaseProvider = $databaseProvider;
        });
    });


    it('should be injectable', inject(function($database) {
        expect($database).to.exist;
        expect($database.query).to.exist;
        expect($database.connect).to.exist;
    }));

    it('should be able to establish connection', function(done) {

        inject(function($rootScope, $timeout, $database) {

            $database.connect().then(function(_connection) {
                expect(_connection).to.exist;
                expect($database.connection).to.exist;
                expect($database.connection).to.not.be.null;
                done(null, _connection);
            }).catch(function(error) {
                done(error);
            });

            // wait for propagation
            $timeout(function() {
                $rootScope.$apply();
            }, 50);

        });

    });


    it.skip('should be able to execute plain sql query', inject(function($rootScope, $database) {

        $database
            .query('SELECT * FROM users')
            .catch(function(error) {
                expect(error).to.exist;
                expect(error.code).to.be.equal(5);
                expect(error.message).to.be.equal('no such table: users');
            });

        //wait for propagation
        $rootScope.$apply();

    }));

});