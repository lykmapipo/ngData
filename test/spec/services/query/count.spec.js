'use strict';

describe('Query#count', function() {

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

    it.skip('should be able to create a count all select query when called without parameter', inject(function(Query) {

        var query = new Query({
            collection: User
        }).select().where().gt({
            age: 21
        }).count();

        //console.log(query.toString());
        expect(query.toString()).to.be.equal('SELECT COUNT(*) FROM customers');

    }));
});
