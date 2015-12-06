'use strict';

describe('Query#find', function() {

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

    it('should be able to build simple select query', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).find();

        expect(query.toString()).to.be.equal('SELECT * FROM customers');

    }));

    it('should return a select query with given single projections', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).find('name');

        expect(query.toString()).to.equal('SELECT name FROM customers');
    }));

    it('should return a select query with given multiple projections', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).find(['name', 'age']);


        expect(query.toString()).to.equal('SELECT name, age FROM customers');

    }));

    it('should return a select query with given multiple projections', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).find('name age');


        expect(query.toString()).to.equal('SELECT name, age FROM customers');

    }));

    it('should be able to find records based on given conditions', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).find({
            name: 'john',
            age: {
                $gt: 30
            }
        });

        /*jshint quotmark:double*/
        expect(query.toString()).to.equal("SELECT * FROM customers WHERE (name = 'john' AND age > 30)");
    }));

    it('should be able to find records on given conditions and projections', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).find({
            name: 'john',
            age: {
                $gt: 30
            }
        }, ['name', 'age']);

        /*jshint quotmark:double*/
        expect(query.toString()).to.equal("SELECT name, age FROM customers WHERE (name = 'john' AND age > 30)");
    }));

    it('should be able to find records given joiner and conditions objects', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).find({
            $or: [{
                name: 'john'
            }, {
                age: {
                    $gt: 30
                }
            }]
        });

        /*jshint quotmark:double*/
        expect(query.toString()).to.equal("SELECT * FROM customers WHERE (name = 'john' OR age > 30)");
    }));


});