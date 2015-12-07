'use strict';

describe('Collection#remove', function() {
    this.timeout = function() {
        return 10000;
    };

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

    it('should be able to remove documents', inject(function() {
        expect(Customer.remove).to.be.a('function');
    }));


    it('should be able to remove documents', function(done) {
        inject(function($rootScope) {

            Customer
                .remove({
                    id: 2
                })
                .then(function(response) {

                    expect(response.rowsAffected).to.be.equal(1);

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