'use strict';

describe('ngData:DataTypes', function() {

    // load the ngData module
    beforeEach(module('ngData'));

    it('should exists after being injected', inject(function(DataTypes) {
        expect(DataTypes).to.exist;
    }));

    it('should be able to map common JS data types to their respective SQL data types', inject(function(DataTypes) {
        expect(DataTypes.string).to.be.equal('TEXT');

        expect(DataTypes.boolean).to.be.equal('INTEGER');
        expect(DataTypes.integer).to.be.equal('INTEGER');
        expect(DataTypes.int).to.be.equal('INTEGER');


        expect(DataTypes.number).to.be.equal('REAL');
        expect(DataTypes.float).to.be.equal('REAL');
        expect(DataTypes.double).to.be.equal('REAL');

        expect(DataTypes.date).to.be.equal('TEXT');
        expect(DataTypes.datetime).to.be.equal('TEXT');

        expect(DataTypes.object).to.be.equal('TEXT');
        expect(DataTypes.array).to.be.equal('TEXT');
        expect(DataTypes.json).to.be.equal('TEXT');

        expect(DataTypes.binary).to.be.equal('BLOB');
        expect(DataTypes.byte).to.be.equal('BLOB');

    }));

});
