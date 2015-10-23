'use strict';

describe('Query#in', function() {
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

    it('should be able to create in condition given criteria', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).select().where().in({
            city: ['mwanza', 'arusha', 'singida']
        });

        expect(query.toString()).to.be.equal('SELECT * FROM customers WHERE (city IN ( "mwanza","arusha","singida" ))');
    }));

    it('should be able to create in condition given criteria and limit value', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).select().where().in({
            city: ['mwanza', 'arusha', 'singida']
        }, 5);

        expect(query.toString()).to.be.equal('SELECT * FROM customers WHERE (city IN ( "mwanza","arusha","singida" )) LIMIT 5');
    }));


});