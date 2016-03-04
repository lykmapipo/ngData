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
            self.store = self.Stores.INDEXED_DB;

            //database connection reference
            self.connection = null;

            //provider implementation
            self.$get = function($q, $window) {
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
                    if ($window.cordova && $window.sqlitePlugin) {

                        self.connection =
                            $window.sqlitePlugin.openDatabase({
                                name: self.name + '.db',
                                description: self.description,
                                version: self.version
                                    // size: self.size
                            });

                    }

                    //otherwise open WebSQL database connection
                    else {
                        self.connection =
                            $window.openDatabase(
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