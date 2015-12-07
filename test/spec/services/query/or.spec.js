'use strict';

describe('Query#or', function() {

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

    it('should be able to to `$or` provided query conditions', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).or([{
            name: 'benson'
        }, {
            age: 20
        }]);

        /*jshint quotmark:double*/
        expect(query.toString())
            .to.be.equal("SELECT * FROM customers WHERE (name = 'benson' OR age = 20)");
    }));

});