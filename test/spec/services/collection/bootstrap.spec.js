'use strict';

describe('Collection', function() {
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
                        presence: true,
                        defaultsTo: faker.name.findName()
                    },
                    code: {
                        type: String,
                        length: {
                            minimum: 3
                        }
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


    it('should be registerable', function() {
        expect(Customer).to.exist;
    });

    //seed data
    it('should be able to seed data', function(done) {

        inject(function($rootScope) {

            Customer
                .create(customers[1])
                .then(function(response) {
                    done(null, response);
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


    it('should be able to seed data', function(done) {

        inject(function($rootScope) {

            Customer
                .create(customers[2])
                .then(function(response) {
                    done(null, response);
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

});