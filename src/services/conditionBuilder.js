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

            var expression;

            /**
             * check the joiner specified by the condition object and call upon
             * condition builder function to build the condition expression
             * @param  {Object} conditions 
             */
            function _join(conditions) {
                // initialize default joiner
                var joiner = 'and';

                if (_.has(conditions, '$or') || _.has(conditions, '$and')) {

                    _.forEach(conditions, function(value, key) {

                        // default joiner if it is not specified


                        if (key === '$or') {
                            joiner = 'or';

                            if (_.isArray(value)) {
                                _.forEach(value, function(val) {
                                    _buildSqlCondition(val, joiner);
                                });
                            }
                        } else if (key === '$and') {
                            joiner = 'and';
                            if (_.isArray(value)) {
                                _.forEach(value, function(val) {
                                    _buildSqlCondition(val, joiner);
                                });
                            }
                        }
                    });
                } else {
                    _buildSqlCondition(conditions, joiner);
                }

            }


            /**
             * build sql condition when given condition object and joiner
             * @param  {Object} conditionObject 
             * @param  {String} joiner          this is the join string that 
             *                                  will be used to join conditions
             */
            function _buildSqlCondition(conditionObject, joiner) {

                if (conditionObject && _.isPlainObject(conditionObject)) {

                    _.forEach(conditionObject, function(value, key) {
                        // check for primitive value and if it is an object 
                        // then we look inside for key value
                        if (_.isPlainObject(value)) {
                            _.forEach(value, function(val, condition) {
                                // initialize the values for IN condition
                                var values = '( ';
                                // initialize the variable for for loop
                                var i;

                                if (joiner === 'or') {
                                    if (condition === '$gt') {
                                        expression.or(key + ' > ' + val);
                                    } else if (condition === '$gte') {
                                        expression.or(key + ' >= ' + val);
                                    } else if (condition === '$lt') {
                                        expression.or(key + ' < ' + val);
                                    } else if (condition === '$lte') {
                                        expression.or(key + ' <= ' + val);
                                    } else if (condition === '$ne') {
                                        expression.or(key + ' <> ' + val);
                                    } else if (condition === '$in') {

                                        if (_.isArray(val)) {

                                            for (i = 0; i < val.length; i++) {

                                                if (i < val.length - 1) {
                                                    values +=
                                                        ('\"' + val[i] + '\"' + ',');
                                                } else {
                                                    values +=
                                                        ('\"' + val[i] + '\"' + ' )');
                                                }
                                            }
                                            expression.
                                            or(key + ' IN ' + values);
                                        }
                                    }

                                    // conditions for AND joiner
                                } else {
                                    if (condition === '$gt') {
                                        expression.and(key + ' > ' + val);
                                    } else if (condition === '$gte') {
                                        expression.and(key + ' >= ' + val);
                                    } else if (condition === '$lt') {
                                        expression.and(key + ' < ' + val);
                                    } else if (condition === '$lte') {
                                        expression.and(key + ' <= ' + val);
                                    } else if (condition === '$ne') {
                                        expression.and(key + ' <> ' + val);
                                    } else if (condition === '$in') {

                                        if (_.isArray(val)) {

                                            for (i = 0; i < val.length; i++) {

                                                if (i < val.length - 1) {
                                                    values +=
                                                        ('\"' + val[i] + '\"' + ',');
                                                } else {
                                                    values +=
                                                        ('\"' + val[i] + '\"' + ' )');
                                                }
                                            }
                                            expression.
                                            and(key + ' IN ' + values);
                                        }
                                    }

                                }

                            });
                            // for primitive values 
                        } else {
                            if (joiner === 'or') {
                                expression.or(key + ' = ' + value);
                            } else {
                                expression.and(key + ' = ' + value);
                            }

                        }

                    });

                }
            }


            /**
             * [buildSqlExpression description]
             * @param  {[type]} conditions condition object specified in find or
             *                             where condition
             * @param  {[type]} sqlExpr    sql expression object
             * @return {Object}            SQL.expr() which will be used by find
             *                             and where condition to build the 
             *                             conditions
             */
            function buildSqlExpression(conditions, sqlExpr) {

                expression = sqlExpr || SQL.expr();

                _join(conditions);

                return expression;
            }


            return buildSqlExpression;
        });

}());