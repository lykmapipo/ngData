'use strict';

describe('Query#gte', function() {
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

    it('should be able to build a simple where greater or equal query condition', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).find().where().gte('age', 20);
        expect(query.toString()).to.equal('SELECT * FROM customers WHERE (age >= 20)');
    }));

    it('should be able to build a greater or equal condition given condition object', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).find().where().gte({
            age: 20,
            height: 40
        });
        expect(query.toString()).to.equal('SELECT * FROM customers WHERE (age >= 20 AND height >= 40)');
    }));

});