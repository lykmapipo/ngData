'use strict';

describe('Query#offset', function() {
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

    it('should be able to add a limit condition to a query', inject(function(Query) {

        var query = new Query({
            collection: Customer
        }).select().offset(10);

        expect(query.toString()).to.be.equal('SELECT * FROM customers OFFSET 10');
    }));


});