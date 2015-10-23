(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name $database
     * @description database connection manager and provider
     */
    angular
        .module('ngData')
        .provider('$database', function() {
            /*jshint validthis:true*/
            var self = this;

            //database properties
            self.name = 'db';
            self.description = 'Database';
            self.version = '1.0.0';
            self.size = 4 * 1024 * 1024;

            //database connection reference
            self.connection = null;


            //model schema definition
            self.schemas = {};

            /**
             * @description register a new model into ngData and compile it
             * @param  {String} name       name of the model
             * @param  {Object} definition model definition
             * @return {Object}            valid ngData model
             */
            self.model = function(name, definition) {
                //check if schema alreay exist
                var schema = _.get(self.schemas, name);
                if (schema && !definition) {
                    return schema;
                }

                //compile a schema definition
                //and register it
                else {
                    //extend definition with schema name
                    definition.name = name;

                    //instantiate a collection with definetion
                    self.schemas[name] = definition;

                    return _.get(self.schemas, name);
                }
            };


            //provider implementation
            self.$get = function($q, DataTypes, $cordovaSQLite) {
                var DB = {};

                //connection magic getter and setter
                Object.defineProperty(DB, 'connection', {
                    get: function() {
                        return self.connection;
                    },
                    set: function(connection) {
                        self.connection = connection;
                    }
                });

                /**
                 * @description initialize database connection
                 * @return {Object} database connection
                 */
                DB.connect = function() {
                    //check if there is
                    //exsting database connection
                    if (self.connection) {
                        return;
                    }

                    //try to open SQLite database connection if we running
                    //on mobile device
                    if (window.cordova) {
                        self.connection = $cordovaSQLite.openDB({
                            name: self.name + '.db',
                            description: self.description,
                            version: self.version
                                // size: self.size
                        });
                    }

                    //otherwise open WebSQL database connection
                    else {
                        self.connection =
                            window.openDatabase(
                                self.name, self.version,
                                self.description, self.size
                            );
                    }

                    return self.connection;
                };


                /**
                 * @description execute the given query
                 * @param  {String} query    SQL query to execute
                 * @param  {Object} bindings query bindings
                 * @return {Promise}         a promise that will resolve with the
                 *                             result of executed query
                 */
                DB.query = function(query, bindings) {
                    //ensure database connection exists
                    DB.connect();

                    return $cordovaSQLite.execute(self.connection, query, bindings);
                };

                //--------------------------------------------------------------
                //sql builder
                //--------------------------------------------------------------

                //create a local copy of sql
                //by cloning/copying a global sql
                var sql = angular.copy(squel);


                //extend insert queries with `values(Array|Object)` builder
                sql.cls.Insert.prototype.values = function(values) {

                    if (_.isPlainObject(values)) {
                        this.setFields(values);
                    } else {
                        //TODO fix collection insertion
                        this.setFieldsRows(values);
                    }

                    return this;
                };


                //extend update set to support object values
                sql.cls.Update.prototype.sets = function(field, value) {

                    if (_.isPlainObject(field)) {
                        this.setFields(field);
                    } else if (field && value) {
                        this.set(field, value);
                    }

                    return this;
                };


                //extend select with ability to pass array fields
                sql.cls.Select.prototype.columns = function(fields) {
                    //is multiple field selection
                    if (_.isArray(fields)) {
                        //iterate over all fields
                        _.forEach(fields, function(field) {
                            this.field(field);
                        }.bind(this));
                    }

                    //is single field selection
                    else {
                        this.field(fields);
                    }

                    return this;

                };


                //extending local sql with then executor
                sql.cls.QueryBuilder.prototype.then = function( /*resolve, reject*/ ) {

                    //prepare sql
                    var sql = this.toString();

                    var promise = DB.query(sql).then();
                    promise = promise.then.apply(promise, arguments);
                    return promise;
                };


                //extending local sql with catch executor
                sql.cls.QueryBuilder.prototype.catch = function( /*reject*/ ) {
                    var promise = this.then();
                    promise = promise.catch.apply(promise, arguments);
                    return promise;
                };


                /**
                 * @description process `SQLResultSetRowList` to obtain data
                 * @param  {SQLResultSetRowList} result [description]
                 * @return {Object|Array}
                 */
                sql.fetch = function(result) {
                    var output = null;

                    if (result.rows) {
                        //fetch an object from `SQLResultSetRowList`
                        if (result.rows.length === 1) {
                            output = angular.copy(result.rows.item(0));
                        }
                    }

                    return output;
                };


                /**
                 * @description process `SQLResultSetRowList` to obtain data
                 * @param  {SQLResultSetRowList} result [description]
                 * @return {Object|Array}
                 */
                sql.fetchAll = function(result) {
                    var output = [];

                    if (result.rows) {
                        for (var i = 0; i < result.rows.length; i++) {
                            output.push(angular.copy(result.rows.item(i)));
                        }
                    }

                    return output;
                };

                DB.sql = sql;


                //--------------------------------------------------------------
                //schema management
                //--------------------------------------------------------------


                /**
                 * @function
                 * @description cast JS data types to respective SQLite3/WebSQL
                 *              data types
                 * @param {String|Constructor} type valid JS type constructor or name
                 * @return {String} valid SQL type or default to TEXT if non found
                 * @private
                 * @see DataTypes
                 * @example
                 *         Number will be converted to REAL
                 *         String will be converted to TEXT
                 *         etc
                 */
                DB.castToSQLType = function(type) {
                    type = type.name || type;
                    return _.get(DataTypes, type, 'TEXT');
                };


                /**
                 * @description normalize given property to use object property 
                 *              definition
                 * @param  {Object|String} property        property definition
                 * @param  {Object} properties schema properties definition
                 * @return {Object}            normalized property definition
                 * @example
                 *         This property definition
                 *         {
                 *             name: String
                 *         }
                 *
                 *         Will be normalized to
                 *         {
                 *             name:{
                 *                 type:String
                 *             }
                 *         }
                 */
                DB.normalizeProperty = function(property, properties) {
                    var _property = {};
                    if (!_.isPlainObject(properties[property])) {
                        _property.type = properties[property];
                    } else {
                        _property = properties[property];
                    }
                    return _property;
                };


                /**
                 * @function
                 * @description build SQL columns DDL definition from schema properties
                 * @param  {Object} properties valid JSON schema properties
                 * @return {String}     valid SQL DDL
                 * @private
                 * @example
                 *         The following schema properties definition
                 *         {
                 *           firstName: {
                 *               type: String,
                 *               unique: true,
                 *               defaultsTo: 'Doe'
                 *           },
                 *           lastName: {
                 *               type: String
                 *           },
                 *           ssn: {
                 *               type: String,
                 *               primaryKey: true,
                 *               index: true
                 *           }
                 *          }
                 *          
                 *          Will get converted to the following SQL
                 *          'firstName TEXT UNIQUE DEFAULT Doe, lastName TEXT, ssn TEXT PRIMARY KEY'
                 */
                DB.propertiesDDL = function(properties) {
                    var ddl = '';

                    // iterate properties and
                    // build SQL DDL per each property
                    _.keys(properties).forEach(function(key /*property name*/ ) {
                        // normalize simple key/value property
                        // ex: name: 'string'
                        var property = DB.normalizeProperty(key, properties);

                        // check if property support autoincrement
                        // and default it to primary key
                        if (property.autoIncrement) {
                            property.type = 'Integer';
                            property.primaryKey = true;
                        }

                        var str = [
                            key, // property name
                            DB.castToSQLType(property.type), // property type
                            property.primaryKey ? 'PRIMARY KEY' : '', // primary key
                            property.unique ? 'UNIQUE' : '', // unique constraint
                            property.defaultsTo ? 'DEFAULT "' + property.defaultsTo + '"' : ''
                        ].join(' ').trim().replace(/\s+/g, ' ');

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
                DB.getIndexes = function(properties) {
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
                DB.toSQLValue = function(value) {

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
                 * @description create schema table
                 * @param  {String} table      name of the table
                 * @param  {Object} properties JSON schema
                 * @return {Promise}
                 */
                DB.createTable = function(table, properties) {
                    //TODO escape table name

                    // iterate through each attribute, building a query string
                    var _schema = DB.propertiesDDL(properties);

                    //Build query
                    var query =
                        'CREATE TABLE IF NOT EXISTS ' + table + ' (' + _schema + ')';

                    // run the query
                    return DB.query(query);

                };


                /**
                 * @description drop schema table
                 * @param  {String} table      name of the table
                 * @return {Promise}
                 */
                DB.dropTable = function(table) {
                    //TODO escape table name

                    //Build query
                    var query =
                        'DROP TABLE IF NOT EXISTS ' + table;

                    // run the query
                    return DB.query(query);

                };


                /**
                 * @function
                 * @description update existing data to comply with the new table structure
                 * @param  {Array} data       current table data
                 * @param  {Object} properties new JSON schema properties
                 * @return {Array}
                 * @private
                 */
                DB.copyData = function(data, properties) {
                    return _.map(data, function(model) {
                        //prepare missing properties data
                        var missing = _.omit(properties, _.keys(model));
                        var additional = {};

                        _.keys(missing).forEach(function(key) {
                            //deduce JS data type
                            var property = DB.normalizeProperty(key, properties);
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
                DB.alter = function(table, properties) {
                    var q = $q.defer();
                    DB.connect();
                    var con = DB.connection;

                    //error processor
                    var _error;

                    function errorHandler(tx, error) {
                        var message = 'Fail to migrate ' + table;
                        message = error && error.message ? error.message : message;

                        _error = new Error(message);
                        return error;
                    }

                    //prepare schema DDL
                    var columns = DB.propertiesDDL(properties);

                    //queries
                    var dropTable =
                        'DROP TABLE IF EXISTS "' + table + '"';

                    var createTable =
                        'CREATE TABLE IF NOT EXISTS "' + table + '" (' + columns + ')';

                    var selectData = 'SELECT * FROM "' + table + '"';

                    con.transaction(
                        //perform table schema upgrade under transaction
                        function(tx) {
                            // try to create table if not exists
                            tx.executeSql(createTable, [], function(tx1 /*,result*/ ) {

                                //select data from existing table
                                tx1.executeSql(selectData, [], function(tx2, result) {

                                    //dump existing data
                                    var all = sql.fetchAll(result);
                                    var dumps = DB.copyData(all, properties);

                                    //drop existing table
                                    tx2.executeSql(dropTable, [], function(tx3 /*,result*/ ) {

                                        //create newly table
                                        tx3.executeSql(createTable, [], function(tx4 /*, result*/ ) {

                                            //re-insert dump                                           
                                            _.forEach(dumps, function(model) {
                                                if (_.isPlainObject(model)) {
                                                    var query =
                                                        sql.insert()
                                                        .into(table)
                                                        .values(model).toString();

                                                    tx4.executeSql(query);
                                                }

                                            });

                                            //resolve
                                            if (_error) {
                                                q.reject(_error);
                                            } else {
                                                q.resolve(table + ' migrated successfully');
                                            }

                                        }, errorHandler); //tx3
                                    }, errorHandler); //tx2
                                }, errorHandler); //tx1
                            }, errorHandler); //tx
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

                //--------------------------------------------------------------
                //model management
                //--------------------------------------------------------------
                DB.models = function() {
                    return self.schemas;
                };

                //export database
                return DB;
            };
            /*jshint validthis:false*/
        });
}());