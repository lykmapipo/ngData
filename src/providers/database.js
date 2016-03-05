(function() {
    'use strict';

    /**
     * @name normalizeProperty
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
    function normalizeProperty(property, properties) {
        var _property = {};
        if (!_.isPlainObject(properties[property])) {
            _property.type = properties[property];
        } else {
            _property = properties[property];
        }
        return _property;
    }


    /**
     * @ngdoc module
     * @name $database
     * @description database connection manager and provider
     */
    angular
        .module('ngData')
        .provider('$database', function(Types) {
            /*jshint validthis:true*/
            var self = this;

            //TODO clone lf to maintain local copy

            //database store type
            self.Stores = lf.schema && lf.schema.DataStoreType;

            //database data types
            self.Type = Types;

            //default database properties
            self.name = 'db';
            self.description = 'Database';
            self.version = '1.0.0';
            self.size = 4 * 1024 * 1024;
            self.store = self.Stores.MEMORY;

            //database connection reference
            self.connection = null;

            //models map registry
            self.models = {};


            /**
             * @description register a new model into ngData and compile it
             * @param  {String} name       name of the model
             * @param  {Object} definition model definition
             * @return {Object}            valid ngData model
             */
            self.model = function(name, definition) {
                //check if model already exist
                var model = name && self.models[name];
                if (model && !definition) {
                    return model;
                }

                //compile a model definition
                //and register it
                else {
                    //no model definition
                    if (!definition) {
                        return;
                    }

                    //continue with model compiling
                    else {
                        //extend definition with collection name
                        definition.collectionName = name;

                        //normalize properties
                        var properties = _.clone(definition.properties);
                        _.forEach(properties, function(def, name) {
                            definition.properties[name] =
                                normalizeProperty(name, properties);
                        });

                        //instantiate a collection with definetion
                        model =
                            self.models[name] = definition;
                        // new Collection(definition);
                        // TODO instantiate a model
                        // TODO build model schema using lovefield

                        return model;
                    }
                }
            };



            //provider implementation
            self.$get = function($q, Collection) {
                var DB = {};

                //prepare database onUpgrade handler
                self.onUpgrade = self.onUpgrade || function onUpgrade(rawDatabase) {
                    return $q.when(rawDatabase);
                };


                //expose connection
                Object.defineProperty(DB, 'connection', {
                    get: function() {
                        return self.connection;
                    },
                    set: function(connection) {
                        self.connection = connection;
                    }
                });


                /**
                 * @name model
                 * @param  {String} modelName valid registered model name
                 * @return {Collection}  an instance of collection
                 */
                DB.model = function(modelName) {
                    return modelName && self.models[modelName];
                };


                /**
                 * @name connect
                 * @description initialize database connection
                 * @return {Promise} database connection
                 * @type {Function}
                 */
                DB.connect = function() {

                    //TODO why not return connection if exists?
                    //TODO detect schema change and reconnect?

                    //reset WebSQL provider based on environment
                    if (window.cordova && window.sqlitePlugin) {
                        window.openDatabase =
                            window.sqlitePlugin.openDatabase;
                    }

                    //TODO compile models
                    _.forEach(_.keys(self.models), function(modelName) {
                        self.models[modelName] =
                            new Collection(self.models[modelName]);
                    });

                    //open database connection
                    var schemaBuilder =
                        lf.schema.create(self.name, self.version);

                    //TODO migrate schemas before connect
                    //add tables
                    _.forEach(self.models, function(model) {
                        //update schema builder with collection schema
                        model.toSchema(schemaBuilder);
                    });

                    var promise = schemaBuilder.connect({
                        storeType: self.store,
                        onUpgrade: self.onUpgrade
                    });

                    return promise.then(function(_connection) {

                        //extend collection with table
                        _.forEach(self.models, function(model) {
                            model.table =
                                _connection.getSchema().table(model.tableName);
                        });

                        self.connection = _connection;

                        return _connection;
                    });

                    //TODO handle database error and rethrow errors

                };

                //export database
                return DB;
            };
            /*jshint validthis:false*/
        });
}());