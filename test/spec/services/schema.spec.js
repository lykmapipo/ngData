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

});