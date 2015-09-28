'use strict';

describe('Query#distinct', function() {

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

    it('should be able to create a select distinct query', inject(function(Query) {
        var query = new Query({
            collection: User
        }).select(['name', 'age', 'gender']).distinct().where().gt('age', 20);
        expect(query.toString()).to.equal('SELECT DISTINCT name, age, gender FROM customers WHERE (age > 20)');
    }));


});
