'use strict';

describe('Model', function() {

    this.timeout = function() {
        return 10000;
    };

    var id;

    //fixtures
    var customers = [{
        name: faker.name.findName(),
        code: Math.ceil(Math.random() * 999)
    }, {
        name: faker.name.findName(),
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


    it('should be injectable', inject(function(Model) {
        expect(Model).to.exist;
    }));

    it('should be able to instantiate new model instance', inject(function(Model) {

        var model = new Model(Customer, customers[0]);

        expect(model.save).to.exist;
        expect(model.remove).to.exist;
        expect(model.toObject).to.exist;
        expect(model.toString).to.exist;
        expect(model.toJSON).to.exist;

    }));

    it('should be able to return instance JSON presentation', inject(function(Model) {

        var model = new Model(Customer, customers[0]);

        expect(_.omit(model.toJSON(), 'id')).to.eql(customers[0]);

    }));

    it('should be able to save new model instance', function(done) {

        inject(function($rootScope, Model) {

            var customer = new Model(Customer, customers[0]);

            customer
                .save()
                .then(function(_customer_) {
                    //reference id
                    id = _customer_.id;

                    expect(_customer_.id).to.exist;
                    expect(_customer_.name).to.equal(customers[0].name);
                    expect(_customer_.code).to.equal(customers[0].code);

                    done(null, _customer_);
                })
                .catch(function( /*error*/ ) {
                    done();
                });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);
        });

    });

    it('should be able to update existing model instance', function(done) {

        inject(function($rootScope, Model) {

            var customer = new Model(Customer, _.merge({
                id: id
            }, customers[0]));

            customer
                .save()
                .then(function(_customer_) {

                    expect(_customer_.id).to.exist;
                    expect(_customer_.name).to.equal(customers[0].name);
                    expect(_customer_.code).to.equal(customers[0].code);

                    done(null, _customer_);
                })
                .catch(function( /*error*/ ) {
                    done();
                });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);
        });

    });

    it('should be able to remove existing model instance', function(done) {

        inject(function($rootScope, Model) {

            var customer = new Model(Customer, _.merge({
                id: id
            }, customers[0]));

            customer
                .remove()
                .then(function(_customer_) {

                    expect(_customer_.id).to.exist;
                    expect(_customer_.name).to.equal(customers[0].name);
                    expect(_customer_.code).to.equal(customers[0].code);

                    done(null, _customer_);
                })
                .catch(function( /*error*/ ) {
                    done();
                });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);
        });

    });
});