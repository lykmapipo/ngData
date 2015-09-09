'use strict';

describe('ngData:DataTypes', function() {

    // load the ngData module
    beforeEach(module('ngData'));

    it('should exists after being injected', inject(function(DataTypes) {
        expect(DataTypes).to.exist;
    }));

    it('should have default values', inject(function(DataTypes) {
        expect(DataTypes.string).to.be.equal('TEXT');

        expect(DataTypes.boolean).to.be.equal('INTEGER');
        expect(DataTypes.integer).to.be.equal('INTEGER');

        expect(DataTypes.number).to.be.equal('REAL');

        expect(DataTypes.date).to.be.equal('TEXT');

        expect(DataTypes.object).to.be.equal('TEXT');
        expect(DataTypes.array).to.be.equal('TEXT');

        expect(DataTypes.blob).to.be.equal('BLOB');

    }));

});