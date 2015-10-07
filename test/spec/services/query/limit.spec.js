'use strict';

describe('Query#limit', function() {

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
        }).select().limit(5);

        expect(query.toString()).to.be.equal('SELECT * FROM customers LIMIT 5');
    }));

});
