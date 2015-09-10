'use strict';


describe('ngData:Schema', function() {
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


    it('should be injectable', inject(function(Schema) {
        expect(Schema).to.exist;
        expect(Schema.castToSQLType).to.exist;
        expect(Schema.propertiesDDL).to.exist;
    }));


    it('should be able to cast js data types to sql type', inject(function(Schema, DataTypes) {
        expect(Schema.castToSQLType('Integer')).to.equal(DataTypes.Integer);
        expect(Schema.castToSQLType(String)).to.equal(DataTypes.String);
    }));


    it('should be able to convert JSON Schema properties to SQL DDL', inject(function(Schema) {

        var ddl = Schema.propertiesDDL(properties);

        var expectedDDL =
            'firstName TEXT  UNIQUE DEFAULT "' + defaultsTo + '", lastName TEXT, ssn TEXT PRIMARY KEY';

        expect(ddl).to.exist;
        expect(ddl).to.equal(expectedDDL);

    }));

    it('should be able to obtain index properties ', inject(function(Schema) {

        var indexes = Schema.getIndexes(properties);

        expect(indexes).to.exist;
        expect(indexes).to.eql(['ssn']);

    }));


    it('should be able to convert JS value to their respective SQL value', inject(function(Schema) {

        var date = new Date();
        var sqlDate = Schema.toSQLValue(date);
        expect(sqlDate).to.equal(date.toUTCString());

        var arrayy = [1, 2, 3, 4];
        var sqlArray = Schema.toSQLValue(arrayy);
        expect(sqlArray).to.equal(JSON.stringify(arrayy));

        var objecti = faker.helpers.contextualCard();
        var sqlObject = Schema.toSQLValue(objecti);
        expect(sqlObject).to.equal(JSON.stringify(objecti));
    }));


    // it('should be able to drop table', function(done) {
    //     inject(function($rootScope, Schema) {

    //         Schema
    //             .dropTable(table)
    //             .then(function(result) {

    //                 expect(result).to.exist;

    //                 done();
    //             })
    //             .catch(function(error) {

    //                 expect(error).to.exist;
    //                 expect(error.message)
    //                     .to.equal('no such table: ' + table);

    //                 done();
    //             });

    //         setTimeout(function() {
    //             $rootScope.$apply();
    //         }, 50);

    //     });
    // });

    // it('should be able to create table', function(done) {
    //     inject(function($rootScope, Schema) {

    //         Schema
    //             .createTable(table, properties)
    //             .then(function(result) {

    //                 expect(result).to.exist;
    //                 expect(result.rows).to.exist;
    //                 expect(result.rowsAffected).to.exist;
    //                 expect(result.insertId).to.exist;

    //                 done();
    //             })
    //             .catch(function(error) {

    //                 expect(error).to.exist;
    //                 expect(error.message)
    //                     .to.equal('no such table: ' + table);

    //                 done();
    //             });

    //         setTimeout(function() {
    //             $rootScope.$apply();
    //         }, 50);

    //     });
    // });


    it('should be able to drop temporary table', function(done) {
        inject(function($rootScope, Schema) {

            Schema
                .dropTemporaryTable(table)
                .then(function(result) {

                    expect(result).to.exist;

                    done();
                })
                .catch(function(error) {

                    expect(error).to.exist;
                    expect(error.message)
                        .to.equal('no such table: ' + table + '_t');

                    done();
                });

            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });

    it('should be able to create temporary table', function(done) {
        inject(function($rootScope, Schema) {

            Schema
                .createTemporaryTable(table, properties)
                .then(function(result) {

                    expect(result).to.exist;
                    expect(result.rows).to.exist;
                    expect(result.rowsAffected).to.exist;
                    expect(result.insertId).to.exist;

                    done();
                })
                .catch(function(error) {

                    expect(error).to.exist;
                    expect(error.message)
                        .to.equal('no such table: ' + table + '_t');

                    done();
                });

            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });


    describe('Migration', function() {

        

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

});