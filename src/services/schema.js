(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name Schema
     * @description schema definition and builder
     */
    angular
        .module('ngData')
        .factory('Schema', function(DataTypes) {
            var Schema = {};

            /**
             * @function
             * @description cast JS data types to respective SQLite3/WebSQL 
             *              data types
             * @param {String|Constructor} type valid JS type constructor or name
             * @return {String} valid SQL type or default to TEXT if non found
             * @private
             */
            Schema.castToSQLType = function(type) {
                type = type.name || type;
                return _.get(DataTypes, type, 'TEXT');
            };


            /**
             * @function
             * @description build SQL columns DDL definition from schema properties
             * @param  {Object} properties valid JSON schema properties
             * @return {String}     valid SQL DDL
             * @private
             */
            Schema.propertiesDDL = function(properties) {
                var ddl = '';

                // iterate properties and 
                // build SQL DDL per each property
                Object.keys(properties).forEach(function(key) {
                    var property = {};

                    // normalize simple key/value property
                    // ex: name: 'string'
                    if (!_.isPlainObject(properties[key])) {
                        property.type = properties[key];
                    } else {
                        property = properties[key];
                    }

                    // check if property support autoincrement
                    if (property.autoIncrement) {
                        property.type = 'Integer';
                        property.primaryKey = true;
                    }

                    var str = [
                        key, // property name
                        Schema.castToSQLType(property.type), // property type
                        property.primaryKey ? 'PRIMARY KEY' : '', // primary key
                        property.unique ? 'UNIQUE' : '', // unique constraint
                        property.defaultsTo ? 'DEFAULT "' + property.defaultsTo + '"' : ''
                    ].join(' ').trim();

                    ddl += str + ', ';
                });

                // Remove trailing seperator/trim
                return ddl.slice(0, -2);
            };


            /**
             * @function
             * @description build an index array from any properties that
             *              have an index key set.
             *
             * @return {Array} array of all indexed properties
             * @private
             */
            Schema.getIndexes = function(properties) {
                // iterate through the properties 
                // and pull out any index property
                return _.compact(_.map(_.keys(properties), function(name) {
                    var property = _.get(properties, name);
                    if (_.has(property, 'index')) {
                        return name;
                    }
                }));

            };


            return Schema;
        });

}());