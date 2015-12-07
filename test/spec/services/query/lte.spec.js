'use strict';

describe('Query#lte', function() {

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

    it('should be able to build a query from less or equal contition', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).lte('age', 20);
        expect(query.toString()).to.equal('SELECT * FROM customers WHERE (age <= 20)');
    }));

    it('should be able to build a less or equal condition given condition object', inject(function(Query) {
        var query = new Query({
                collection: Customer
            })
            .where('age').lte(20)
            .where('height').lte(40);

        expect(query.toString()).to.equal('SELECT * FROM customers WHERE (age <= 20 AND height <= 40)');
    }));

});