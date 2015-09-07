'use strict';

describe('ngData:DataTypes', function() {
    var DataTypes;

    // load the controller's module
    beforeEach(module('ngData'));

    // inject ngDataTypes
    beforeEach(inject(function(ngDataTypes) {
        DataTypes = ngDataTypes;
    }));

    it('should exists after being injected', function() {
        expect(DataTypes).to.exists;
    });

    it('should have default values', function() {
        expect(DataTypes.string).to.be.equal('TEXT');
        expect(DataTypes.text).to.be.equal('TEXT');

        expect(DataTypes.boolean).to.be.equal('INTEGER');
        expect(DataTypes.int).to.be.equal('INTEGER');
        expect(DataTypes.integer).to.be.equal('INTEGER');

        expect(DataTypes.number).to.be.equal('REAL');
        expect(DataTypes.float).to.be.equal('REAL');
        expect(DataTypes.double).to.be.equal('REAL');

        expect(DataTypes.date).to.be.equal('TEXT');
        expect(DataTypes.datetime).to.be.equal('TEXT');

        expect(DataTypes.object).to.be.equal('TEXT');
        expect(DataTypes.json).to.be.equal('TEXT');
        expect(DataTypes.array).to.be.equal('TEXT');

        expect(DataTypes.binary).to.be.equal('BLOB');
        expect(DataTypes.bytea).to.be.equal('BLOB');
    });
});