'use strict';

describe('Query#select', function() {

    var Customer;

    beforeEach(module('ngData'));

    beforeEach(inject(function($ngData) {
        Customer = $ngData.model('Customer', {
            properties: {
                name: {
                    type: String,
                    defaultsTo: faker.name.findName()
                },
                code: {
                    type: String
                },
                age: {
                    type: Number,
                    defaultsTo: 20
                }
            }
        });
    }));

    it('should be able to build a simple select query', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).select('name');
        expect(query.toString()).to.equal('SELECT name FROM customers');
    }));

    it('should be able to build a multiple projections select query', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).select(['name', 'age', 'gender']);
        expect(query.toString()).to.equal('SELECT name, age, gender FROM customers');
    }));

    it('should be able to build a simple select query chain with where conditions', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).select(['name', 'age', 'gender']).where().gt('age', 27).equals('gender', 'male');

        /*jshint quotmark:double*/
        expect(query.toString()).to.equal("SELECT name, age, gender FROM customers WHERE (age > 27 AND gender = 'male')");
    }));

});