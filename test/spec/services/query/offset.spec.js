'use strict';

describe('Query#offset', function() {

    var User;
    beforeEach(module('ngData'));

    beforeEach(inject(function($ngData) {
        User = $ngData.model('Customer', {
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

    it('should be able to add a limit condition to a query', inject(function(Query) {

        var query = new Query({
            collection: User
        }).select().offset(10);

        expect(query.toString()).to.be.equal('SELECT * FROM customers OFFSET 10');
    }));


});
