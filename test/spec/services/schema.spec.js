'use strict';

describe('ngData:schema factory', function() {

    // load the ngData module
    beforeEach(module('ngData'));


    it('should be injectable', inject(function(Schema) {
        expect(Schema).to.exist;
        expect(Schema.sqlTypeCast).to.exist;
        expect(Schema.build).to.exist;
    }));

});