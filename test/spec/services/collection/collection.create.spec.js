'use strict';

describe('Collection#create', function() {
    this.timeout = function() {
        return 10000;
    };

    //fixtures
    var customers = [{
        name: faker.name.firstName(),
        code: Math.ceil(Math.random() * 999)
    }, {
        name: faker.name.firstName(),
        code: Math.ceil(Math.random() * 999)
    }];

    //customer model
    var Customer;

    beforeEach(module('ngData'));

    beforeEach(function(done) {

        inject(function($ngData, $rootScope) {
            Customer = $ngData.model('Customer', {
                properties: {
                    name: {
                        type: String,
                        defaultsTo: faker.name.findName()
                    },
                    code: {
                        type: String
                    }
                }
            });

            $ngData.initialize().then(function(response) {
                done(null, response);
            }).catch(function(error) {
                done(error);
            });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });

    beforeEach(function(done) {

        inject(function($rootScope) {
            Customer.remove().then(function(response) {
                done(null, response);
            }).catch(function(error) {
                done(error);
            });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });

    });

    it('should be able to create documents', inject(function() {
        expect(Customer.create).to.be.a('function');
    }));

    it('should be able to create a new record and save it into the database', function(done) {

        inject(function($rootScope) {

            Customer
                .create(customers[0])
                .then(function(customer) {

                    expect(customer.id).to.exist;
                    expect(customer.name).to.equal(customers[0].name);
                    expect(customer.code).to.equal(customers[0].code);

                    done(null, customer);
                })
                .catch(function(error) {
                    done(error);
                });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);
        });

    });

    it('should be able to create a new records and save them into the database');
});