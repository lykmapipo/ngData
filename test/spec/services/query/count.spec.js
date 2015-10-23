'use strict';

describe('Query#count', function() {
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

    it.skip('should be able to create a count all select query when called without parameter', inject(function(Query) {

        var query = new Query({
            collection: Customer
        }).select().where().gt({
            age: 21
        }).count();

        //console.log(query.toString());
        expect(query.toString()).to.be.equal('SELECT COUNT(*) FROM customers');

    }));
});