(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.ConditionBuilder
     * @description build where conditions in ngData
     * @return {Function} condition builder function that is build the 
     * the sql condition expression and return it
     */

    angular
        .module('ngData')
        .factory('conditionBuilder', function(SQL) {

            var self = this;

            var builder = function(conditions, expression) {

                // var joiner = joiner || ' AND ';
                if (expression) {
                    self.expression = expression;
                } else {
                    self.expression = SQL.expr();
                }

                if (conditions && _.isPlainObject(conditions)) {

                    _.forEach(conditions, function(value, key) {

                        if (_.isObject(value)) {
                            // condition is the one specified in the condition
                            // object

                            _.forEach(value, function(val, condition) {
                                // building condition expression
                                if (condition === '$gt') {
                                    self.expression.and(key + ' > ' + val);
                                } else if (condition === '$gte') {
                                    self.expression.and(key + ' >= ' + val);
                                } else if (condition === '$lt') {
                                    self.expression.and(key + ' < ' + val);
                                } else if (condition === '$lte') {
                                    self.expression.and(key + ' <= ' + val);
                                } else if (condition === '$ne') {
                                    self.expression.and(key + ' <> ' + val);
                                } else if (condition === '$in') {
                                    var values = '( ';

                                    if (_.isArray(val)) {

                                        for (var i = 0; i < val.length; i++) {

                                            if (i < val.length - 1) {
                                                values +=
                                                    ('\"' + val[i] + '\"' + ',');
                                            } else {
                                                values +=
                                                    ('\"' + val[i] + '\"' + ' )');
                                            }
                                        }
                                        this.expression.
                                        and(key + ' IN ' + values);
                                    }
                                }
                            }.bind(self));

                        } else {
                            //  this build equal condition 
                            self.expression.and(key + ' = ' + value);
                        }

                    }.bind(self));

                }

                return self.expression;
            };

            // var joiner = joiner || ' AND ';

            return builder;
        });

}());
