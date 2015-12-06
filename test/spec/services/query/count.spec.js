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

    it('should be able to create a count all query', inject(function(Query) {

        var query = new Query({
            collection: Customer
        }).count();

        expect(query.toString()).to.be.equal('SELECT COUNT(*) FROM customers');

    }));

    it('should be able to create a count all query', inject(function(Query) {

        var query = new Query({
            collection: Customer
        }).count({
            name: 'lorem'
        });

        /*jshint quotmark:double*/
        expect(query.toString()).to.be.equal("SELECT COUNT(*) FROM customers WHERE (name = 'lorem')");

    }));
});