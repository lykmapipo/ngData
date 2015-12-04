'use strict';

describe('Query#update', function() {

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

    it('should be able to create an update query', inject(function(Query) {
        var query = new Query({
            collection: Customer,
            type: 'update'
        });

        query = query.update({
            id: 1
        }, {
            code: '7464'
        });

        /*jshint quotmark:double*/
        expect(query.toString()).to.be.equal("UPDATE customers SET code = '7464' WHERE (id = 1)");
    }));


});