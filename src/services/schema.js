(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name Schema
     * @description schema definition and builder
     */
    angular
        .module('ngData')
        .factory('Schema', function($q, DataTypes, $database, SQL) {
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

            Schema.normalizeProperty = function(key, properties) {
                var _property = {};
                if (!_.isPlainObject(properties[key])) {
                    _property.type = properties[key];
                } else {
                    _property = properties[key];
                }
                return _property;
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
                    // normalize simple key/value property
                    // ex: name: 'string'
                    var property = Schema.normalizeProperty(key, properties);

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

                //Build query
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
             * @function
             * @description update existing data to comply with the new table structure
             * @param  {Array} data       current table data
             * @param  {Object} properties new JSON schema properties
             * @return {Array}
             * @private
             */
            Schema.copyData = function(data, properties) {
                return _.map(data, function(model) {
                    //prepare missing properties data
                    var missing = _.omit(properties, _.keys(model));
                    var additional = {};

                    _.keys(missing).forEach(function(key) {
                        //deduce JS data type
                        var property = Schema.normalizeProperty(key, properties);
                        var type =
                            (property.type.name || property.type) || 'String';

                        //obtain property default value
                        var defaultsTo = properties[key].defaultsTo;
                        switch (type) {
                            case 'String':
                                additional[key] = defaultsTo || '';
                                break;
                            case 'Boolean':
                                additional[key] = defaultsTo || true;
                                break;
                            case 'Number':
                                additional[key] = defaultsTo || 0;
                                break;
                            case 'Date':
                                additional[key] = defaultsTo || new Date();
                                break;
                            case 'Object':
                                additional[key] = defaultsTo || {};
                                break;
                            case 'Array':
                            case 'Int8Array':
                            case 'Uint8Array':
                            case 'Uint8ClampedArray':
                            case 'Int16Array':
                            case 'Uint16Array':
                            case 'Int32Array':
                            case 'Uint32Array':
                            case 'Float32Array':
                            case 'Float64Array':
                                additional[key] = defaultsTo || [];
                                break;
                            default:
                                additional[key] = '';
                                break;
                        }
                    });

                    //merge additional with original data
                    var data = _.merge(model, additional);

                    //remove unwanted properties
                    _.forEach(_.keys(data), function(key) {
                        if (!_.has(properties, key)) {
                            data = _.omit(data, key);
                        }
                    });

                    return data;
                });
            };


            /**
             * @description alter schema table structure in case of any changes
             * @param  {String} table      name of the table
             * @param  {Object} properties JSON schema
             * @return {Promise}
             */
            Schema.alter = function(table, properties) {
                var q = $q.defer();
                $database.connect();
                var con = $database.connection;

                //error processor
                var _error;

                function errorHandler(tx, error) {
                    var message = 'Fail to migrate ' + table;
                    message = error && error.message ? error.message : message;

                    _error = new Error(message);
                    return error;
                }

                //TODO make use of transaction
                var columns = Schema.propertiesDDL(properties);

                //queries
                var dropTable =
                    'DROP TABLE IF EXISTS "' + table + '"';

                var createTable =
                    'CREATE TABLE IF NOT EXISTS "' + table + '" (' + columns + ')';

                var selectData = 'SELECT * FROM "' + table + '"';

                con
                    .transaction(
                        //perform table schema upgrade under transaction
                        function(tx) {
                            // try to create table if not exists
                            tx.executeSql(createTable);

                            //select data from existing table
                            tx.executeSql(selectData, [], function(tx, result) {
                                console.log(Schema.copyData(SQL.fetchAll(result)));
                            }, errorHandler);

                            //drop existing table
                            tx.executeSql(dropTable);

                            //create newly table
                            tx.executeSql(createTable);

                            //insert data

                            if (_error) {
                                q.reject(_error);
                            } else {
                                q.resolve(1);
                            }
                        },
                        //handle transaction error
                        function(tx, error) {
                            if (!_error) {
                                errorHandler(error);
                            }
                            q.reject(_error);
                        });

                return q.promise;
            };

            return Schema;
        });

}());