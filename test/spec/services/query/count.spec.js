'use strict';

describe('Query#count', function() {

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

    it.skip('should be able to create a count all select query when called without parameter', inject(function(Query) {

        var query = new Query({
            collection: Customer
        }).select().where().gt({
            age: 21
        }).count();

        expect(query.toString()).to.be.equal('SELECT COUNT(*) FROM customers');

    }));
});