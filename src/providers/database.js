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

            //database store type
            self.Stores = lf.schema && lf.schema.DataStoreType;

            //default database properties
            self.name = 'db';
            self.description = 'Database';
            self.version = '1.0.0';
            self.size = 4 * 1024 * 1024;
            self.store = self.Stores.MEMORY;

            //database connection reference
            self.connection = null;

            //provider implementation
            self.$get = function($q) {
                var DB = {};

                //prepare database onUpgrade handler
                self.onUpgrade = self.onUpgrade || function onUpgrade(rawDatabase) {
                    console.log(rawDatabase);
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
                    //check if there is
                    //exsting database connection
                    if (self.connection) {
                        return $q.when(self.connection);
                    }

                    //reset WebSQL provider based on environment
                    if (window.cordova && window.sqlitePlugin) {
                        window.openDatabase =
                            window.sqlitePlugin.openDatabase;
                    }

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

                    bindings = bindings || [];

                    var q = $q.defer();

                    self.connection.transaction(function(tx) {
                        tx.executeSql(query, bindings, function(_tx, result) {
                                q.resolve(result);
                            },
                            function(__tx, error) {
                                q.reject(error);
                            });
                    });

                    return q.promise;
                };

                //export database
                return DB;
            };
            /*jshint validthis:false*/
        });
}());