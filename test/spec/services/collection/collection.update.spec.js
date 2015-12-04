'use strict';

describe('Collection#update', function() {
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


    it('should be able to remove documents', inject(function() {
        expect(Customer.remove).to.be.a('function');
    }));

    it('should be able to update documents', function(done) {
        inject(function($rootScope) {

            Customer
                .update({
                    id: 1
                }, customers[1])
                .then(function(response) {
                    
                    console.log(response.rowsAffected);
                    console.log(response.rows);

                    done(null, response);

                })
                .catch(function(error) {
                    console.log(error.message);
                    done(error);
                });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });

});