'use strict';

describe('$ngData', function() {

    // load the ngData module
    beforeEach(module('ngData'));


    it('should be injectable', inject(function($ngData) {
        expect($ngData).to.exist;
    }));


    describe('Model register', function() {

        it('should be able to register a model', inject(function($ngData) {
            expect($ngData.model).to.exist;
            expect($ngData.model).to.be.a('function');

            var User = $ngData.model('User', {
                tableName: 'users',
                properties: {
                    firstName: String
                }
            });

            expect(User).to.exist;
            expect(User.tableName).to.exist;
            expect(User.name).to.exist;
            expect(User.definition).to.exist;
            expect($ngData.model('User')).to.exist;

        }));

        it('should be able inflect table name from model name', inject(function($ngData) {
            expect($ngData.model).to.exist;
            expect($ngData.model).to.be.a('function');

            var User = $ngData.model('User', {
                properties: {
                    firstName: {
                        type: String
                    }
                }
            });

            expect(User.tableName).to.exist;
            expect(User.tableName).to.be.equal('users');

        }));

    });

});