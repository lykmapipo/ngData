'use strict';

describe('ngData:$database', function() {
    this.timeout = function() {
        return 5000;
    };

    // load the ngData module
    beforeEach(module('ngData'));


    it('should be injectable', inject(function($database) {
        expect($database).to.exist;
        expect($database.query).to.exist;
        expect($database.connect).to.exist;
    }));

    it('should be able to establish connection', inject(function($database) {
        $database.connect();
        expect($database.connection).to.exist;
        expect($database.connection.transaction).to.exist;
    }));


    it('should be able to execute plain sql query', function(done) {

        inject(function($rootScope, $database) {

            $database
                .query('SELECT * FROM users')
                .catch(function(error) {
                    expect(error).to.exist;
                    expect(error.code).to.be.equal(5);
                    expect(error.message).to.be.equal('no such table: users');
                });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
                done();
            }, 1000);


        });
    });

});