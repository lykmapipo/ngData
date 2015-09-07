(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData
     * @description provide helpers to configure ngData
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


            //provider implementation
            self.$get = function($cordovaSQLite) {
                var DB = {};

                //deference database connection
                DB.connection = null;

                /**
                 * @description initialize database connection
                 * @return {Object} database connection
                 */
                DB.connect = function() {
                    //try to open SQLite database connection if we running
                    //on mobile device
                    if (window.cordova) {
                        DB.connection = $cordovaSQLite.openDB({
                            name: self.name + '.db',
                            description: self.description,
                            version: self.version
                                // size: self.size
                        });
                    }

                    //otherwise open WebSQL database connection 
                    else {
                        DB.connection =
                            window.openDatabase(
                                self.name, self.version,
                                self.description, self.size
                            );
                    }
                };


                /**
                 * @description execute the given query
                 * @param  {String} query    SQL query to execute
                 * @param  {Object} bindings query bindings
                 * @return {Promise}         a promise that will resolve with the
                 *                             result of executed query
                 */
                DB.query = function(query, bindings) {
                    return $cordovaSQLite.execute(DB.connection, query, bindings);
                };

                //export database
                return DB;
            };
            /*jshint validthis:false*/
        });
}());