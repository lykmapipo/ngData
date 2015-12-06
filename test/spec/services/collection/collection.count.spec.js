'use strict';

describe('Collection#count', function() {
    this.timeout = function() {
        return 10000;
    };

    //fixtures
    // var customers = [{
    //     name: faker.name.findName(),
    //     code: faker.random.uuid()
    // }, {
    //     name: faker.name.findName(),
    //     code: faker.random.uuid()
    // }, {
    //     name: faker.name.findName(),
    //     code: faker.random.uuid()
    // }];

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


    // beforeEach(function(done) {

    //     inject(function($rootScope) {

    //         Customer
    //             .create(customers[1])
    //             .then(function(response) {
    //                 done(null, response);
    //             })
    //             .catch(function(error) {
    //                 console.log(error);
    //                 done(error);
    //             });

    //         //wait for propagation
    //         setTimeout(function() {
    //             $rootScope.$apply();
    //         }, 50);

    //     });

    // });


    it('should be able to count documents', inject(function() {
        expect(Customer.count).to.be.a('function');
    }));

    it('should be able to all count existing documents', function(done) {
        inject(function($rootScope) {

            Customer
                .count()
                .then(function(response) {

                    expect(response.count).to.exist;

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

    it('should be able to all count existing documents using specified conditions', function(done) {
        inject(function($rootScope) {

            Customer
                .count({
                    name: faker.name.findName()
                })
                .then(function(response) {

                    expect(response.count).to.exist;

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