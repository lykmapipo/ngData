'use strict';

//more query examples can be found at
//https://hiddentao.github.io/squel/
describe('SQL', function() {

    // load the ngData module
    beforeEach(module('ngData'));

    it('should be injectable', inject(function(SQL) {
        expect(SQL).to.exist;

        expect(SQL.select().then).to.exist;
        expect(SQL.select().catch).to.exist;

        expect(SQL.insert().then).to.exist;
        expect(SQL.insert().catch).to.exist;

        expect(SQL.update().then).to.exist;
        expect(SQL.update().catch).to.exist;

        expect(SQL.delete().then).to.exist;
        expect(SQL.delete().catch).to.exist;

    }));

    it('should be able to build `SELECT` query', inject(function(SQL) {
        var query = SQL.select().from('users').toString();
        expect(query).to.equal('SELECT * FROM users');
    }));

    it('should be able to build `UPDATE` query', inject(function(SQL) {
        var firstName = faker.name.firstName();

        var query =
            SQL.update().table('users').set('firstName', firstName).toString();

        expect(query)
            .to.equal('UPDATE users SET firstName = \'' + firstName + '\'');
    }));

    it('should be able to build `DELETE` query', inject(function(SQL) {
        var query = SQL.delete().from('users').toString();
        expect(query).to.equal('DELETE FROM users');
    }));

    it('should be able to build `INSERT` query', inject(function(SQL) {
        var firstName = faker.name.firstName();

        var query =
            SQL.insert().into('users').values({
                firstName: firstName
            }).toString();

        expect(query)
            .to.equal('INSERT INTO users (firstName) VALUES (\'' + firstName + '\')');
    }));

    it('should be able to execute `INSERT` sql query', inject(function($rootScope, SQL) {

        SQL
            .insert()
            .into('users')
            .values({
                firstName: faker.name.firstName()
            })
            .catch(function(error) {
                expect(error).to.exist;
                expect(error.code).to.be.equal(5);
                expect(error.message).to.be.equal('no such table: users');
            });

        //wait for propagation
        $rootScope.$apply();
    }));

    it('should be able to execute `SELECT` sql query', inject(function($rootScope, SQL) {

        SQL
            .select()
            .from('users')
            .catch(function(error) {
                expect(error).to.exist;
                expect(error.code).to.be.equal(5);
                expect(error.message).to.be.equal('no such table: users');
            });

        //wait for propagation
        $rootScope.$apply();

    }));

    it('should be able to execute `UPDATE` sql query', inject(function($rootScope, SQL) {

        SQL
            .update()
            .table('users')
            .set('firstName', faker.name.firstName())
            .catch(function(error) {
                expect(error).to.exist;
                expect(error.code).to.be.equal(5);
                expect(error.message).to.be.equal('no such table: users');
            });

        //wait for propagation
        $rootScope.$apply();

    }));

    it('should be able to execute `DELETE` sql query', inject(function($rootScope, SQL) {

        SQL
            .delete()
            .from('users')
            .catch(function(error) {
                expect(error).to.exist;
                expect(error.code).to.be.equal(5);
                expect(error.message).to.be.equal('no such table: users');
            });

        //wait for propagation
        $rootScope.$apply();

    }));

});