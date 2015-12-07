'use strict';

describe('Collection#update', function() {
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

    it('should be able to update documents', function(done) {
        inject(function($rootScope) {

            Customer
                .update({
                    id: 1
                }, customers[1])
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