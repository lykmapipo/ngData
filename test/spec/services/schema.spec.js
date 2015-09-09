'use strict';


describe('ngData:schema factory', function() {
    var defaultsTo = faker.name.firstName();

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

});