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


    it('should be able to alter schema table structure', function(done) {
        inject(function($rootScope, Schema) {

            Schema
                .alter(table, properties)
                .then(function(result) {
                    console.log('r');
                    console.log(result);
                    // console.log(result.rowsAffected);
                    // console.log(result.insertId);

                    done();
                })
                .catch(function(error) {
                    console.log('e');
                    console.log(error.message);

                    done();
                });

            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });

});