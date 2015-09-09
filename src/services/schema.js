(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name Schema
     * @description schema builder based on sails-sqlite
     * @see https://github.com/AndrewJo/sails-sqlite3
     */
    angular
        .module('ngData')
        .factory('Schema', function(DataTypes) {
            var SchemaBuilder = {};

            /**
             * @function
             * @description cast js types to SQLite3/WebSQL data types
             * @return {String}
             */
            SchemaBuilder.toSQLType = function(type) {
                type = type.name || type;
                return DataTypes[type] || 'TEXT';
            };

            /**
             * @description build SQL DDL definition from JSON schema attributes
             * @param  {Object} attributes valid JSON schema
             * @return {String}     valid SQL DDL
             */
            SchemaBuilder.toDDL = function(attributes) {
                var schema = '';

                // iterate attributes and 
                // build SQL DDL per each attribute
                Object.keys(attributes).forEach(function(key) {
                    var attribute = {};

                    // normalize simple key/value attribute
                    // ex: name: 'string'
                    if (!_.isPlainObject(attributes[key])) {
                        attribute.type = attributes[key];
                    } else {
                        attribute = attributes[key];
                    }

                    // check if attribute support autoincrement
                    if (attribute.autoIncrement) {
                        attribute.type = 'Integer';
                        attribute.primaryKey = true;
                    }

                    var str = [
                        key, // attribute name
                        SchemaBuilder.toSQLType(attribute.type), // attribute type
                        attribute.primaryKey ? 'PRIMARY KEY' : '', // primary key
                        attribute.unique ? 'UNIQUE' : '', // unique constraint
                        attribute.defaultsTo ? 'DEFAULT "' + attribute.defaultsTo + '"' : ''
                    ].join(' ').trim();

                    schema += str + ', ';
                });

                // Remove trailing seperator/trim
                return schema.slice(0, -2);
            };


            /**
             * @description build an index array from any attributes that
             *              have an index key set.
             */
            SchemaBuilder.toIndexes = function(attributes) {
                var indexes = [];

                // iterate through the attributes 
                // and pull out any index attribute
                Object.keys(attributes).forEach(function(key) {
                    if (attributes[key].hasOwnProperty('index')) {
                        indexes.push(key);
                    }
                });

                return indexes;
            };


            return SchemaBuilder;
        });

}());