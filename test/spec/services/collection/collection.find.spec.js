'use strict';

describe('Collection#find', function() {
    this.timeout = function() {
        return 10000;
    };

    //fixtures
    // var customers = [{
    //     name: faker.name.firstName(),
    //     code: Math.ceil(Math.random() * 999)
    // }, {
    //     name: faker.name.firstName(),
    //     code: Math.ceil(Math.random() * 999)
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


    it('should be able to find documents', inject(function() {
        expect(Customer.find).to.be.a('function');
    }));

    it('should be able to find documents', function(done) {
        inject(function($rootScope) {

            Customer
                .find()
                .then(function(_customers_) {

                    expect(_customers_).to.have.length.above(0);
                    expect(_customers_[0].id).to.exist;
                    expect(_customers_[0].name).to.exist;
                    expect(_customers_[0].code).to.exist;

                    done(null, _customers_);
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