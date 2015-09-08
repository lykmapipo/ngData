'use strict';

describe('ngData:schema factory', function() {

    // load the ngData module
    beforeEach(module('ngData'));


    it('should be injectable', inject(function(Schema) {
        expect(Schema).to.exist;
        expect(Schema.sqlTypeCast).to.exist;
        expect(Schema.build).to.exist;
    }));

    it('should be able to cast js types to sql type', inject(function(Schema, DataTypes) {
        expect(Schema.sqlTypeCast('integer')).to.equal(DataTypes.integer);
    }));


    it('should be able to convert JSON Schema attribitute to SQL DDL', inject(function(Schema, DataTypes) {
        var attributes = {
            firstName: {
                type: DataTypes.string,
                unique: true,
                defaultsTo: faker.name.firstName()
            },
            lastName: {
                type: 'string'
            },
            ssn: {
                type: 'string',
                primaryKey: true
            }
        };

        var ddl = Schema.build(attributes);

        expect(ddl).to.exist;

    }));

});