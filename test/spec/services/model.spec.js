'use strict';

describe('ngData:Model', function() {

    beforeEach(module('ngData'));

    it('should be injectable', inject(function(Model) {

        expect(Model).to.exist;

        var model = new Model();

        expect(model.save).to.exist;
        expect(model.remove).to.exist;
        expect(model.toObject).to.exist;
        expect(model.toString).to.exist;
        expect(model.toJSON).to.exist;

    }));

    it('should  be able to save the model instance');

    it('should be able to remove the model instance');

    it('should be able to parse the model instance to string');

    it('should be able to parse the model instance to JSON');
});