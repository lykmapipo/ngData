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

            //TODO clone lf to maintain local copy

            //database store type
            self.Stores = lf.schema && lf.schema.DataStoreType;

            //database data types
            self.Types = lf.Type;

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
                        //extend definition with model name
                        definition.name = name;

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
                 * @name connect
                 * @description initialize database connection
                 * @return {Promise} database connection
                 * @type {Function}
                 */
                DB.connect = function() {

                    //reset WebSQL provider based on environment
                    if (window.cordova && window.sqlitePlugin) {
                        window.openDatabase =
                            window.sqlitePlugin.openDatabase;
                    }

                    //TODO compile models
                    _.forEach(_.keys(self.models), function(modelName) {
                        self.model[modelName] =
                            new Collection(self.models[modelName]);
                    });

                    //TODO update schema builder with model schema
                    //open database connection
                    //TODO migrate schemas before connect
                    var promise =
                        lf.schema.create(self.name, self.version).connect({
                            storeType: self.store,
                            onUpgrade: self.onUpgrade
                        });

                    return promise.then(function(_connection) {
                        self.connection = _connection;
                        return _connection;
                    });

                };

                //export database
                return DB;
            };
            /*jshint validthis:false*/
        });
}());