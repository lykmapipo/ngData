'use strict';

describe('Model', function() {

    this.timeout = function() {
        return 10000;
    };

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

    beforeEach(function(done) {

        inject(function($rootScope) {
            Customer.remove().then(function(response) {
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

        var model = new Model(Customer);

        expect(model.save).to.exist;
        expect(model.remove).to.exist;
        expect(model.toObject).to.exist;
        expect(model.toString).to.exist;
        expect(model.toJSON).to.exist;

    }));

    it('should  be able to save the model instance');

    it('should be able to remove the model instance');

    it('should be able to parse the model instance to string');

    it('should be able to parse the model instance to JSON');
});