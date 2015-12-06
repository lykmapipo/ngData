'use strict';

describe('Query#gt', function() {

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

    it('should be able to build a simple where greater than query condition', inject(function(Query) {
        var query = new Query({
                collection: Customer
            })
            .gt('age', 20);

        expect(query.toString()).to.equal('SELECT * FROM customers WHERE (age > 20)');
    }));

    it('should be able to build a greater than chained conditions', inject(function(Query) {
        var query = new Query({
                collection: Customer
            })
            .where('age').gt(20)
            .where('height').gt(40);

        expect(query.toString()).to.equal('SELECT * FROM customers WHERE (age > 20 AND height > 40)');
    }));

});