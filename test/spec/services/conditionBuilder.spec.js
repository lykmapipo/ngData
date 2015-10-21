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
                name: 'john',
                age: 20
            };

            expect(conditionBuilder(condition, SQL.expr()).toString())
                .to.equal('name = john AND age = 20');
        }));

    it('should be able to build expression given  plain condition object',
        inject(function(conditionBuilder) {
            var condition = {
                name: 'john',
                age: 20
            };

            expect(conditionBuilder(condition).toString())
                .to.equal('name = john AND age = 20');
        }));

    it('should be able to build expression given conditions in the condition object',
        inject(function(conditionBuilder) {
            var condition = {
                age: {
                    $gt: 20
                },
                name: 'john',
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
                .be.equal('age > 20 AND name = john AND height >= 206 AND weight < 60 AND lives IN ( "arusha","mbeya","iringa" )');
        }));

    it('should be able to build expression given or as a condition joiner', inject(function(conditionBuilder) {

        var condition = {
            $or: [{
                age: {
                    $gt: 20
                }
            }, {
                name: 'john'
            }, {
                height: {
                    $gte: 206
                }
            }, {
                weight: {
                    $lt: 60
                }
            }, {
                lives: {
                    $in: ['arusha', 'mbeya', 'iringa']
                }
            }]
        };
        expect(conditionBuilder(condition).toString()).to.equal('age > 20 OR name = john OR height >= 206 OR weight < 60 OR lives IN ( "arusha","mbeya","iringa" )');
    }));

    it('should be able to build expression joined with AND when not given and as a joiner', inject(function(conditionBuilder) {
        var condition = {
            $and: [{
                age: {
                    $gt: 20
                }
            }, {
                name: 'john'
            }, {
                height: {
                    $gte: 206
                }
            }, {
                weight: {
                    $lt: 60
                }
            }, {
                lives: {
                    $in: ['arusha', 'mbeya', 'iringa']
                }
            }]
        };

        expect(conditionBuilder(condition).toString()).to.equal('age > 20 AND name = john AND height >= 206 AND weight < 60 AND lives IN ( "arusha","mbeya","iringa" )');
    }));

    it('should be able to build expression joined with OR and AND both used as joiners', inject(function(conditionBuilder) {
        var condition = {
            $or: [{
                age: {
                    $gt: 20
                }
            }, {
                name: 'john'
            }],
            $and: [{
                height: 200
            }, {
                gender: 'M'
            }]

        };

        expect(conditionBuilder(condition).toString()).to.equal('(age > 20 OR name = john) AND (height = 200 AND gender = M)');
    }));

});
