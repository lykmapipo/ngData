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

            var User = $ngData.model('User', {
                tableName: 'users',
                properties: {
                    firstName: String
                }
            });

            expect(User).to.exist;
            expect(User.tableName).to.exist;
            expect(User.name).to.exist;
            expect(User.definition).to.exist;
            expect($ngData.model('User')).to.exist;

        }));

        it('should be able inflect table name from model name', inject(function($ngData) {
            expect($ngData.model).to.exist;
            expect($ngData.model).to.be.a('function');

            var User = $ngData.model('User', {
                properties: {
                    firstName: {
                        type: String
                    }
                }
            });

            expect(User.tableName).to.exist;
            expect(User.tableName).to.be.equal('users');

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