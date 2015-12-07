'use strict';

describe('Query#and', function() {

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


    it('should be able to to `$and` provided query conditions', inject(function(Query) {
        var query = new Query({
            collection: Customer
        }).and([{
            name: 'benson'
        }, {
            age: 20
        }]);

        /*jshint quotmark:double*/
        expect(query.toString())
            .to.be.equal("SELECT * FROM customers WHERE (name = 'benson' AND age = 20)");
    }));

});