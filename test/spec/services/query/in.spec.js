'use strict';

describe('Query#in', function() {

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

    it('should be able to create query using specified in condition', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).where('city').in(['mwanza', 'arusha', 'singida']);

        /*jshint quotmark:double*/
        expect(query.toString()).to.be.equal("SELECT * FROM customers WHERE (city IN ('mwanza','arusha','singida'))");
    }));

    it('should be able to create query using specified in condition', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).in('city', ['mwanza', 'arusha', 'singida']);

        /*jshint quotmark:double*/
        expect(query.toString()).to.be.equal("SELECT * FROM customers WHERE (city IN ('mwanza','arusha','singida'))");
    }));


});