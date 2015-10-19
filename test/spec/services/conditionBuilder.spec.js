'use strict';

describe('ConditionBuilder', function() {

    beforeEach(module('ngData'));


    it('should be injectable', inject(function(conditionBuilder) {

        var builder = conditionBuilder;

        expect(builder).to.exists;
    }));

    it('should be able to build expression given  plain condition object and sql expression',
        inject(function(conditionBuilder, SQL) {
            var condition = {
                name: 'benson',
                age: 20
            };

            expect(conditionBuilder(condition, SQL.expr()).toString())
                .to.equal('name = benson AND age = 20');
        }));

    it('should be able to build expression given  plain condition object',
        inject(function(conditionBuilder) {
            var condition = {
                name: 'benson',
                age: 20
            };

            expect(conditionBuilder(condition).toString())
                .to.equal('name = benson AND age = 20');
        }));

    it('should be able to build expression given conditions in the condition object',
        inject(function(conditionBuilder) {
            var condition = {
                age: {
                    $gt: 20
                },
                name: 'benson',
                height: {
                    $gte: 206
                },
                weight: {
                    $lt: 60
                },
                lives: {
                    $in: ['arusha', 'mbeya', 'iringa']
                }
            };

            expect(conditionBuilder(condition).toString()).to
                .be.equal('age > 20 AND name = benson AND height >= 206 AND weight < 60 AND lives IN ( "arusha","mbeya","iringa" )');
        }));

});
