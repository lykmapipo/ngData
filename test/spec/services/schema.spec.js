'use strict';

describe('ngData:schema factory', function() {

    // load the ngData module
    beforeEach(module('ngData'));


    it('should be injectable', inject(function(Schema) {
        expect(Schema).to.exist;
        expect(Schema.toSQLType).to.exist;
        expect(Schema.toDDL).to.exist;
    }));

    it('should be able to cast js types to sql type', inject(function(Schema, DataTypes) {
        expect(Schema.toSQLType('Integer')).to.equal(DataTypes.Integer);
        expect(Schema.toSQLType(String)).to.equal(DataTypes.String);
    }));


    it('should be able to convert JSON Schema attributes to SQL DDL', inject(function(Schema, DataTypes) {
        var defaultsTo = faker.name.firstName();
        var attributes = {
            firstName: {
                type: DataTypes.String,
                unique: true,
                defaultsTo: defaultsTo
            },
            lastName: {
                type: String
            },
            ssn: {
                type: String,
                primaryKey: true
            }
        };

        var ddl = Schema.toDDL(attributes);

        var expectedDDL =
            'firstName TEXT  UNIQUE DEFAULT "' + defaultsTo + '", lastName TEXT, ssn TEXT PRIMARY KEY';

        expect(ddl).to.equal(expectedDDL);

        expect(ddl).to.exist;

    }));

});