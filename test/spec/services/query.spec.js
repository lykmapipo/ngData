'use strict';

describe('Query', function() {

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

    it('should be injectable', inject(function(Query) {
        var query = new Query({
            collection: User
        });

        expect(query).to.exist;

        expect(query).to.be.instanceof(Query);

    }));

    it('should be able to select record based on criteria');

    it('should be able to find records on given conditions or criteria');

    it('should be able to find a record based on a given  record id');

    it('should be able to find a record based on a given id and remove it from the database');

    it('should be able to find a record based on a given id and update it based on update object');

    it('should be able to  find only one object based on  given conditions and criteria');

    it('should be able to find a record and remove it based on the given conditions');

    it('should be able to find a record and update it based on the given conditions');

    it('should be able to create a query that passes the conditions and return a query');

    it('should be able to specify the number of record that a query should return');

    it('should be able to set the sort order based on the given argument');

    it('should be able to specify  greater than query condition');

    it('should be able to specify  greate or equal query condition');

    it('should be able to specify  less than query condition');

    it('should be able to specify  less or equal query condition');

    it('should be able to specify in query condition');

    it('should be able to specify the records fields that are to be included');

    it('should be able to specify the arguments of and condition');

    it('should be able to specify the arguments of or condition');

    it('should be able to specify the arguments of nor condition');

    it('should be able to define index for model schema');

    it('should be able to specify a query as a count query');

    it('should be able to declare and execute distinct() function');

    it('should be able to specify the complementary comparison value for paths specified with where()');

    it('should be able to specify an exist condition in a query');

    it('should be able to execute a query and return a promise');

});
