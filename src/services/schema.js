(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name Schema
     * @description schema definition and builder
     */
    angular
        .module('ngData')
        .factory('Schema', function(DataTypes, $database) {
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
                _.keys(properties).forEach(function(key /*property name*/ ) {
                    var property = {};

                    // normalize simple key/value property
                    // ex: name: 'string'
                    if (!_.isPlainObject(properties[key])) {
                        property.type = properties[key];
                    } else {
                        property = properties[key];
                    }

                    // check if property support autoincrement
                    // and default it to primary key
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


            /**
             * @function
             * @description transform a JS type to corresponding SQL type
             * @param {Object} value value to be converted to SQL value
             * @return {Object} SQL value for the given JS value
             * @private
             */
            Schema.toSQLValue = function(value) {

                // cast dates to SQL date
                if (_.isDate(value)) {
                    value = value.toUTCString();
                }

                // cast functions to strings
                if (_.isFunction(value)) {
                    value = value.toString();
                }

                // cast Arrays as strings
                if (_.isArray(value) || _.isTypedArray(value)) {
                    value = JSON.stringify(value);
                }

                // stringify object value
                if (_.isPlainObject(value)) {
                    value = JSON.stringify(value);
                }

                //TODO add blob convertion support

                return value;
            };


            /**
             * @function
             * @description drop a schema database table
             * @return {Promise} promise that will eventually resolve with the 
             *                           result of drop a table
             *
             * @private
             */
            Schema.dropTable = function(tableName) {
                // TODO escape table name

                // prepare drop query
                var query = 'DROP TABLE ' + tableName;

                // run the query
                return $database.query(query, undefined);
            };


            /**
             * @description  add a new column to the table
             * @param {String}   table    name of the table
             * @param {[type]}   attrDef  attribute definition
             * @return {Promise} 
             */
            Schema.addColumn = function(table, attrDef) {
                //TODO escape table name

                //prepare column schema
                var schema = Schema.propertiesDDL(attrDef);

                //TODO fix unique column alter

                // build query
                var query = 'ALTER TABLE ' + table + ' ADD COLUMN ' + schema;

                //execute query
                return $database.query(query, undefined);

            };


            // Remove attribute from table
            // In SQLite3, this is tricky since there's no support for DROP COLUMN 
            // in ALTER TABLE. We'll have to rename the old table, create a new table
            // with the same name minus the column and copy all the data over.
            Schema.removeColumn = function(table /*, attrName*/ ) {
                //TODO escape table name

                //query to rename table
                var oldTableName = table + '_old_';
                var renameTableQuery =
                    'ALTER TABLE ' + table + ' RENAME TO ' + oldTableName;

                //TODO create a new table using existing schema
                //TODO copy all data from old table to new table

                return $database.query(renameTableQuery, undefined);
            };


            return Schema;
        });

}());