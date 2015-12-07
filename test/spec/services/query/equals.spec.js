'use strict';

describe('Query#equals', function() {

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

    it('should be able to build a simple where equals condition', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).where('age').equals(20);

        expect(query.toString()).to.equal('SELECT * FROM customers WHERE (age = 20)');
    }));

    it('should be able to chain where equals conditions', inject(function(Query) {
        var query = new Query({
                collection: Customer
            })
            .where('age').equals(20)
            .where('name').equals('john');

        /*jshint quotmark:double*/
        expect(query.toString()).to.equal("SELECT * FROM customers WHERE (age = 20 AND name = 'john')");
    }));

});