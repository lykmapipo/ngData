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
             * @param {String} table name of schema
             * @return {Promise} promise 
             * @private
             */
            Schema.dropTable = function(table) {
                // TODO escape table name

                // prepare drop query
                var query = 'DROP TABLE ' + table;

                // run the query
                return $database.query(query);
            };


            /**
             * @function
             * @description drop a schema tempotrary database table
             * @param {String} table name of schema
             * @return {Promise} promise
             * @private
             */
            Schema.dropTemporaryTable = function(table) {
                //obtain temporary table name
                table = table + '_t';

                // run the query
                return Schema.dropTable(table);
            };


            /**
             * @description create schema table
             * @param  {String} table      name of the table
             * @param  {Object} properties JSON schema
             * @return {Promise}
             */
            Schema.createTable = function(table, properties) {
                //TODO escape table name

                // iterate through each attribute, building a query string
                var _schema = Schema.propertiesDDL(properties);

                // Build query
                var query =
                    'CREATE TABLE ' + table + ' (' + _schema + ')';

                // run the query
                return $database.query(query);

            };


            /**
             * @description create schema temporary table
             * @param  {String} table      name of the table
             * @param  {Object} properties JSON schema
             * @return {Promise}
             */
            Schema.createTemporaryTable = function(table, properties) {
                //obtain temporary table name
                table = table + '_t';

                // run the query
                return Schema.createTable(table, properties);

            };

            /**
             * @description alter schema table structure in case of any changes
             * @param  {String} table      name of the table
             * @param  {Object} properties JSON schema
             * @return {Promise}
             */
            Schema.alter = function(table /*, previousProps , newProps*/ ) {
                //TODO make use of transaction
                // var tempTable = table + '_t';

                // iterate through each attribute, building a query string
                // var _schema = Schema.propertiesDDL(previousProps);

                // create temporary table
                // var query ='CREATE TABLE ' + tempTable + ' (' + _schema + ');';

                // copy data to temporary table
                // query +='INSERT INTO ' + tempTable + ' AS SELECT * FROM ' + table + ';';

                var query = 'SELECT * FROM ' + table + ';';

                console.log(query);

                //create a temporary table
                // return Schema
                //     .createTemporaryTable(table, previousProps)
                //     .then(function() { //TODO copy all data to temporary table
                //         return Query.select().from(table);
                //     })
                //     .then(function(results) {
                //         return Query.fetchAll(results);
                //     })
                //     .then(function(result) {
                //         //drop original table
                //         console.log(result);
                //         return Schema.dropTable(table);
                //     })
                //     .then(function() {
                //         //create a new table
                //         return Schema.createTable(table, newProps);
                //     })
                //     .then(function() {
                //         //TODO copy data from temporary table
                //         //drop temporary table
                //         return Schema.dropTemporaryTable(table);
                //     });
                return $database.query(query);
            };


            return Schema;
        });

}());