'use strict';

describe('$ngData', function() {
    this.timeout = function() {
        return 8000;
    };

    // load the ngData module
    beforeEach(module('ngData'));


    it('should be injectable', inject(function($ngData) {
        expect($ngData).to.exist;
    }));


    describe('Model register', function() {

        it('should be able to register a model', inject(function($ngData) {
            expect($ngData.model).to.exist;
            expect($ngData.model).to.be.a('function');

            var Customer = $ngData.model('Customer', {
                tableName: 'users',
                properties: {
                    firstName: String
                }
            });

            expect(Customer).to.exist;
            expect(Customer.tableName).to.exist;
            expect(Customer.name).to.exist;
            expect(Customer.definition).to.exist;
            expect($ngData.model('Customer')).to.exist;

        }));

        it('should be able inflect table name from model name', inject(function($ngData) {
            expect($ngData.model).to.exist;
            expect($ngData.model).to.be.a('function');

            var Customer = $ngData.model('Customer', {
                properties: {
                    firstName: {
                        type: String
                    }
                }
            });

            expect(Customer.tableName).to.exist;
            expect(Customer.tableName).to.be.equal('customers');

        }));

    });

    it('should be able to initialize database schema', function(done) {
        inject(function($ngData, $rootScope) {
            $ngData.model('Customer', {
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

            $ngData.initialize().then(function(result) {

                    expect(result).to.exist;
                    expect(result[0]).to.be.equal('customers migrated successfully');

                    done(null, result);
                })
                .catch(function(error) {
                    done(error);
                });

            // wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });

});