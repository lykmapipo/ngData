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

    it('should be able to validate a document', inject(function($rootScope) {

        Customer.validate(customers[0]).then(function(model) {
            expect(_.omit(model.toObject(), 'id')).to.eql(customers[0]);
        });

        //wait for propagation
        setTimeout(function() {
            $rootScope.$apply();
        }, 50);

    }));

});