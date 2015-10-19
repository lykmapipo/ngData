'use strict';

describe('Query#find', function() {

    var User;
    beforeEach(module('ngData'));

    beforeEach(inject(function($ngData) {
        User = $ngData.model('Customer', {
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
            collection: User
        }).find();

        expect(query.toString()).to.be.equal('SELECT * FROM customers');

    }));

    it('should return a select query with given single projections', inject(function(Query) {
        var query = new Query({
            collection: User
        }).find('name');

        expect(query.toString()).to.equal('SELECT name FROM customers');
    }));

    it('should return a select query with given multiple projections', inject(function(Query) {
        var query = new Query({
            collection: User
        }).find(['name', 'age']);


        expect(query.toString()).to.equal('SELECT name, age FROM customers');
    }));

    it('should be able to find records based on given conditions', inject(function(Query) {
        var query = new Query({
            collection: User
        }).find({
            name: 'john',
            age: {
                $gt: 30
            }
        });

        expect(query.toString()).to.equal('SELECT * FROM customers WHERE (name = john AND age > 30)');
    }));

    it('should be able to find records on given conditions and projections', inject(function(Query) {
        var query = new Query({
            collection: User
        }).find({
            name: 'john',
            age: {
                $gt: 30
            }
        }, ['name', 'age']);

        expect(query.toString()).to.equal('SELECT name, age FROM customers WHERE (name = john AND age > 30)');
    }));


});
