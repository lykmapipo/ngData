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
            SchemaBuilder.sqlTypeCast = function(type) {
                return DataTypes[type.toLowerCase()] || 'TEXT';
            };

            /**
             * @description build SQL DDL definition from JSON schema attributes
             * @param  {Object} attributes valid JSON schema
             * @return {String}     valid SQL DDL
             */
            SchemaBuilder.build = function(attributes) {
                var schema = '';

                // Iterate through attributes and build SQL string
                Object.keys(attributes).forEach(function(key) {
                    var attribute = {};

                    // Normalize Simple Key/Value attribute
                    // ex: name: 'string'
                    if (typeof attributes[key] === 'string') {
                        attribute.type = attributes[key];
                    }

                    // Set the attribute values to the object key
                    else {
                        attribute = attributes[key];
                    }

                    // Override Type for autoIncrement
                    if (attribute.autoIncrement) {
                        attribute.type = 'serial';
                        attribute.primaryKey = true;
                    }

                    var str = [
                        '"' + key + '"', // attribute name
                        SchemaBuilder.sqlTypeCast(attribute.type), // attribute type
                        attribute.primaryKey ? 'PRIMARY KEY' : '', // primary key
                        attribute.unique ? 'UNIQUE' : '', // unique constraint
                        attribute.defaultsTo ? 'DEFAULT "' + attribute.defaultsTo + '"' : ''
                    ].join(' ').trim();

                    schema += str + ', ';
                });

                // Remove trailing seperator/trim
                return schema.slice(0, -2);
            };

            return SchemaBuilder;
        });
}());