'use strict';

describe('Collection#count', function() {
    this.timeout = function() {
        return 10000;
    };

    //customer model
    var Customer;

    beforeEach(module('ngData'));

    beforeEach(inject(function($ngData) {

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

    }));

    it('should be able to count documents', inject(function() {
        expect(Customer.count).to.be.a('function');
    }));

    it('should be able to count all existing documents', function(done) {
        inject(function($rootScope) {

            Customer
                .count()
                .then(function(response) {

                    expect(response.count).to.exist;
                    expect(response.count).to.be.at.least(2);

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
                    expect(response.count).to.equal(0);

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