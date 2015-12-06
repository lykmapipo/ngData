'use strict';

describe('Collection#create', function() {
    this.timeout = function() {
        return 10000;
    };

    //fixtures
    var customers = [{
        name: faker.name.findName(),
        code: faker.random.uuid()
    }, {
        name: faker.name.findName(),
        code: faker.random.uuid()
    }, {
        name: faker.name.findName(),
        code: faker.random.uuid()
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

    // beforeEach(function(done) {

    //     inject(function($rootScope) {
    //         Customer.remove().then(function(response) {
    //             done(null, response);
    //         }).catch(function(error) {
    //             done(error);
    //         });

    //         //wait for propagation
    //         setTimeout(function() {
    //             $rootScope.$apply();
    //         }, 50);

    //     });

    // });

    it('should be able to create documents', inject(function() {
        expect(Customer.create).to.be.a('function');
    }));

    it('should be able to create a new record and save it into the database', function(done) {

        inject(function($rootScope) {

            Customer
                .create(_.first(customers))
                .then(function(customer) {

                    expect(customer.id).to.exist;
                    expect(customer.name).to.equal(_.first(customers).name);
                    expect(customer.code).to.equal(_.first(customers).code);

                    done(null, customer);
                })
                .catch(function(error) {
                    console.log(error.message);
                    done();
                });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);
        });

    });

    it('should be able to create new records and save them into the database', function(done) {

        inject(function($rootScope) {

            Customer
                .create([customers[1]])
                .then(function(_customers_) {

                    expect(_customers_[0].id).to.exist;
                    expect(_customers_[0].name).to.equal(customers[1].name);
                    expect(_customers_[0].code).to.equal(customers[1].code);

                    done(null, _customers_);
                })
                .catch(function(error) {
                    console.log(error.message);
                    done();
                });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);
        });

    });
});