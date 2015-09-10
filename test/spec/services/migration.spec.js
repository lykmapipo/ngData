'use strict';


describe('ngData:Migration', function() {
    this.timeout = function() {
        return 8000;
    };

    var defaultsTo = faker.name.firstName();
    var table = 'users';

    var properties = {
        firstName: {
            type: String,
            unique: true,
            defaultsTo: defaultsTo
        },
        lastName: {
            type: String
        },
        ssn: {
            type: String,
            primaryKey: true,
            index: true
        }
    };

    // load the ngData module
    beforeEach(module('ngData'));

    beforeEach(function(done) {
        inject(function($rootScope, Schema) {

            Schema
                .createTable(table, properties)
                .then(function(result) {
                    expect(result).to.exist;
                    done();
                })
                .catch(function(error) {
                    expect(error).to.exist;
                    done();
                });

            setTimeout(function() {
                $rootScope.$apply();
            }, 50);


        });
    });

    beforeEach(function(done) {
        inject(function($rootScope, Schema) {

            Schema
                .dropTemporaryTable(table)
                .then(function(result) {
                    expect(result).to.exist;
                    done();
                })
                .catch(function(error) {
                    expect(error).to.exist;
                    done();
                });

            setTimeout(function() {
                $rootScope.$apply();
            }, 50);


        });
    });

    beforeEach(function(done) {
        inject(function($rootScope, Query) {

            Query
                .insert()
                .into(table)
                .values({
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    ssn: faker.random.number().toString(),
                })
                .then(function(result) {
                    expect(result).to.exist;
                    done();
                })
                .catch(function(error) {
                    expect(error).to.exist;
                    done();
                });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });


    it('should be able to alter schema table structure', function(done) {
        inject(function($rootScope, Schema) {

            Schema
                .alter(table, properties)
                .then(function(result) {
                    console.log(result);

                    done();
                })
                .catch(function(error) {
                    console.log(error);

                    done();
                });

            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });

});