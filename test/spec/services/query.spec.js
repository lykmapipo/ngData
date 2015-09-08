'use strict';

//more query examples can be found at
//https://hiddentao.github.io/squel/
describe('ngData:Query Builder factory', function() {
    this.timeout = function() {
        return 5000;
    };

    // load the ngData module
    beforeEach(module('ngData'));

    it('should be injectable', inject(function(Query) {
        expect(Query).to.exist;

        expect(Query.select().then).to.exist;
        expect(Query.select().catch).to.exist;

        expect(Query.insert().then).to.exist;
        expect(Query.insert().catch).to.exist;

        expect(Query.update().then).to.exist;
        expect(Query.update().catch).to.exist;

        expect(Query.delete().then).to.exist;
        expect(Query.delete().catch).to.exist;

    }));

    it('should be able to build `SELECT` query', inject(function(Query) {
        var query = Query.select().from('users').toString();
        expect(query).to.equal('SELECT * FROM users');
    }));

    it('should be able to build `UPDATE` query', inject(function(Query) {
        var firstName = faker.name.firstName();

        var query =
            Query.update().table('users').set('firstName', firstName).toString();

        expect(query)
            .to.equal('UPDATE users SET firstName = \'' + firstName + '\'');
    }));

    it('should be able to build `DELETE` query', inject(function(Query) {
        var query = Query.delete().from('users').toString();
        expect(query).to.equal('DELETE FROM users');
    }));

    it('should be able to build `INSERT` query', inject(function(Query) {
        var firstName = faker.name.firstName();

        var query =
            Query.insert().into('users').values({
                firstName: firstName
            }).toString();

        expect(query)
            .to.equal('INSERT INTO users (firstName) VALUES (\'' + firstName + '\')');
    }));

    it('should be able to execute `INSERT` sql query', function(done) {

        inject(function($rootScope, Query) {

            Query
                .insert()
                .into('users')
                .values([{
                    firstName: faker.name.firstName()
                }])
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

    it('should be able to execute `SELECT` sql query', function(done) {

        inject(function($rootScope, Query) {

            Query
                .select()
                .from('users')
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

    it('should be able to execute `UPDATE` sql query', function(done) {

        inject(function($rootScope, Query) {

            Query
                .update()
                .table('users')
                .set('firstName', faker.name.firstName())
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

    it('should be able to execute `DELETE` sql query', function(done) {

        inject(function($rootScope, Query) {

            Query
                .delete()
                .from('users')
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