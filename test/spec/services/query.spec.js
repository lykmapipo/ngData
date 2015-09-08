'use strict';

//more query examples can be found at
//https://hiddentao.github.io/squel/
describe('ngData:Query factory', function() {
    this.timeout = function() {
        return 5000;
    };

    // load the ngData module
    beforeEach(module('ngData'));

    it('should be injectable', inject(function(Query) {
        expect(Query).to.exist;
        expect(Query.select().then).to.exist;
    }));

    it('should be able to build `SELECT` query', inject(function(Query) {
        var query = Query.select().from('users').toString();
        expect(query).to.equal('SELECT * FROM users');
    }));

    it('should be able to build `UPDATE` query', inject(function(Query) {
        var query =
            Query.update().table('users').set('firstName', 'abcdef').toString();
        expect(query).to.equal('UPDATE users SET firstName = \'abcdef\'');
    }));

    it('should be able to build `DELETE` query', inject(function(Query) {
        var query = Query.delete().from('users').toString();
        expect(query).to.equal('DELETE FROM users');
    }));

    it('should be able to build `INSERT` query', inject(function(Query) {
        var query =
            Query.insert().into('users').set('firstName', 'abcdef').toString();
        expect(query).to.equal('INSERT INTO users (firstName) VALUES (\'abcdef\')');
    }));


    it('should be able to execute sql query from query builder', function(done) {

        inject(function($rootScope, Query) {

            Query
                .select()
                .from('users')
                .then(function() {})
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