'use strict';

describe('Collection#findById', function() {
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

    it('should be able to find a document by id', inject(function() {
        expect(Customer.findById).to.be.a('function');
    }));

    it('should be able to find a document by its id', function(done) {
        inject(function($rootScope) {

            Customer
                .findById(1)
                .then(function(_customer_) {

                    expect(_customer_.id).to.exist;
                    expect(_customer_.name).to.exist;
                    expect(_customer_.code).to.exist;

                    done(null, _customer_);
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