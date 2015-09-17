'use strict';

describe('$ngData', function() {

    // load the ngData module
    beforeEach(module('ngData'));


    it('should be injectable', inject(function($ngData) {
        expect($ngData).to.exist;
    }));

});