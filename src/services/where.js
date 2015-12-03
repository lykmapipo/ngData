(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.$where
     * @description build where conditions from mongodb query object
     * @return {Function} condition builder function that is build the 
     * the sql condition expression and return it
     */

    angular
        .module('ngData')
        .factory('$where', function(SQL) {

            function buildSQLCondition(joiner, condition, key, value) {
                //this refer to expression context
                /*jshint validthis:true*/

                //harminize condition joiner
                //default to and
                joiner = joiner || 'and';

                //obtain condition function
                var fn = this[joiner];

                if (condition === '$gt') {
                    fn.call(this, key + ' > ' + value);
                } else if (condition === '$gte') {
                    fn.call(this, key + ' >= ' + value);
                } else if (condition === '$lt') {
                    fn.call(this, key + ' < ' + value);
                } else if (condition === '$lte') {
                    fn.call(this, key + ' <= ' + value);
                } else if (condition === '$ne') {
                    fn.call(this, key + ' <> ' + value);
                } else if (condition === '$eq') {
                    fn.call(this, key + ' = ' + value);
                } else if (condition === '$in') {

                    if (!_.isArray(value)) {
                        value = [value];
                    }

                    //TODO what if IN operator used in other type than string
                    value = _.map(value, function(val) {
                        return ['"', val, '"'].join('');
                    }).join(',');

                    value = ['(', value, ')'].join('');

                    fn.call(this, key + ' IN ' + value);
                }
            }


            /**
             * @description build sql condition from given condition and joiner
             * @param  {Object} conditions a valid condition object
             * @param  {String} joiner valid query join string
             * @return {Object} an sql expression
             */
            function _where(expression, conditions, joiner) {

                if (conditions && _.isPlainObject(conditions)) {

                    _.forEach(conditions, function(value, key) {
                        // if it is a plain object 
                        // look inside for key value
                        if (_.isPlainObject(value)) {
                            _.forEach(value, function(val, condition) {
                                buildSQLCondition.call(expression, joiner, condition, key, val);
                            });
                        }

                        //else handle primitive values to object
                        else {
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
             * @description convert SQL query from mongodb query object
             * @param  {Object} conditions
             */
            function $where(expression, conditions) {
                // default expression joiner
                var joiner = 'and';

                // enclosing parenthes in order to obey algebra's laws
                var orEnclose = false;
                var andEnclose = false;

                if (_.has(conditions, '$and') || _.has(conditions, '$or')) {

                    _.forEach(conditions, function(value, key) {
                        if (key === '$and' || key === '$or') {
                            //iterate over the objects in the value array

                            if (_.has(conditions, '$and') && _.keysIn(conditions).length > 1) {
                                andEnclose = true;
                            }

                            if (_.has(conditions, '$or') && _.keysIn(conditions).length > 1) {
                                orEnclose = true;
                            }

                            /*jshint camelcase: false*/
                            if (orEnclose) {
                                expression.or_begin();
                            }

                            if (andEnclose) {
                                expression.and_begin();
                            }

                            /* jshint camelcase: true*/
                            _.forEach(value, function(val) {
                                //check if the inner objects are still joiners
                                if (_.has(val, '$and') || _.has(val, '$or')) {

                                    _.forEach(val, function(v, k) {
                                        if (k === '$and') {
                                            /*jshint camelcase: false*/
                                            expression.or_begin();
                                            /* jshint camelcase: true*/
                                            _.forEach(v, function(obj) {
                                                _where(expression, obj);
                                            });
                                            expression.end();

                                        } else if (k === '$or') {
                                            joiner = 'or';
                                            /*jshint camelcase: false*/
                                            expression.and_begin();
                                            /* jshint camelcase: true*/
                                            _.forEach(v, function(obj) {
                                                _where(expression, obj, joiner);
                                            });
                                            expression.end();
                                        } else {
                                            joiner = 'and';
                                            var conditionObject = {};
                                            conditionObject[k] = v;
                                            _where(expression, conditionObject, joiner);
                                        }
                                    });


                                } else if (key === '$or') {
                                    joiner = 'or';
                                    _where(expression, val, joiner);
                                } else {
                                    _where(expression, val);
                                }
                            });

                            // close the parenthes for the conditons
                            if (orEnclose || andEnclose) {
                                expression.end();
                            }

                        } else {
                            //harmonize primitive types to object
                            var conditionObject = {};
                            conditionObject[key] = value;
                            _where(expression, conditionObject);
                        }
                    });
                }
                //continue with simple conditions
                else {
                    _where(expression, conditions);
                }
            }


            /**
             * @description convert mongodb query object to SQL query
             * @param  {Object} conditions valid mongodb query object
             * @param  {[Object]} expression an instance squell expression
             * @return {Object} an instance of squel expression
             */
            function where(conditions, expression) {

                expression = expression || SQL.expr();

                $where(expression, conditions);

                return expression;
            }

            return where;
        });

}());