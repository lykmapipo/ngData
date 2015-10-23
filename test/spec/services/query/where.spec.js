'use strict';

describe('Query#where', function() {
    var Customer;
    var databaseProvider;

    beforeEach(function() {
        module('ngData', function($databaseProvider) {
            databaseProvider = $databaseProvider;
        });
    });

    beforeEach(inject(function($ngData) {
        databaseProvider.model('Customer', {
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

        //compile model
        $ngData.initialize();
        Customer = $ngData.model('Customer');

    }));

    it('should be able to return a query given condition object', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).find().where({
            name: 'benson',
            age: 20
        });

        expect(query.toString()).to.be.equal('SELECT * FROM customers WHERE (name = benson AND age = 20)');
    }));

    it('should be able to return a query given condition object and joiner using find()', inject(function(Query) {
        var condition = {
            $or: [{
                age: {
                    $gt: 20
                }
            }, {
                name: 'john'
            }, {
                height: {
                    $gte: 206
                }
            }, {
                weight: {
                    $lt: 60
                }
            }, {
                lives: {
                    $in: ['arusha', 'mbeya', 'iringa']
                }
            }]
        };

        var query = new Query({
            collection: Customer
        }).find().where(condition);

        expect(query.toString()).to.be.equal('SELECT * FROM customers WHERE (age > 20 OR name = john OR height >= 206 OR weight < 60 OR lives IN ( "arusha","mbeya","iringa" ))');
    }));

    it('should be able to return a query given condition object and joiner using select()', inject(function(Query) {
        var condition = {
            $or: [{
                age: {
                    $gt: 20
                }
            }, {
                name: 'john'
            }, {
                height: {
                    $gte: 206
                }
            }, {
                weight: {
                    $lt: 60
                }
            }, {
                lives: {
                    $in: ['arusha', 'mbeya', 'iringa']
                }
            }]
        };

        var query = new Query({
            collection: Customer
        }).select().where(condition);

        expect(query.toString()).to.be.equal('SELECT * FROM customers WHERE (age > 20 OR name = john OR height >= 206 OR weight < 60 OR lives IN ( "arusha","mbeya","iringa" ))');
    }));

});