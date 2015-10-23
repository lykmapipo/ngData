'use strict';

describe('Collection', function() {
    var Customer;
    var databaseProvider;

    beforeEach(function() {
        module('ngData', function($databaseProvider) {
            databaseProvider = $databaseProvider;
        });
    });

    beforeEach(inject(function($ngData) {
        databaseProvider.model('Customer', {
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

        //compile model
        $ngData.initialize();
        Customer = $ngData.model('Customer');
        
    }));

    describe('Collection#new', function() {

        it('should be able to instantiate new model instance', inject(function() {

            expect(Customer.new).to.exist;
            var user = Customer.new();

            expect(user).to.exist;
            expect(user).to.have.ownProperty('name');
            expect(user).to.have.ownProperty('code');

        }));

        it('should be able to instantiate new model instance with data', inject(function() {

            var _user = {
                name: faker.name.findName(),
                code: faker.random.uuid()
            };

            var user = Customer.new(_user);

            expect(user.name).to.be.equal(_user.name);
            expect(user.code).to.be.equal(_user.code);

        }));

    });

    describe('Collection#create', function() {
        it('should be an instance of query', inject(function(Query) {
            var query = Customer.create();
            expect(query).to.be.an.instanceof(Query);
        }));
    });

    describe('Collection#remove', function() {
        it('should be an instance of query', inject(function(Query) {
            var query = Customer.remove();
            expect(query).to.be.an.instanceof(Query);
        }));
    });

    describe('Collection#update', function() {
        it('should be an instance of query', inject(function(Query) {
            var query = Customer.update();
            expect(query).to.be.an.instanceof(Query);
        }));
    });

    it('should be able to create a new record and save it into the database');

    it('should be able to update the record in the database without returning them');

    it('should be able to remove the selected record from collection');

});