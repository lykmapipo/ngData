(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData
     * @description establish database connection based on environment
     */
    angular
        .module('ngData')
        .factory('Database', function($rootScope, $cordovaSQLite) {

            var DB = {};

            DB.connection = null;

            /**
             * @description initialize database connection
             * @return {Object} database connection
             */
            DB.connect = function() {
                //open SQLite database connection if we running
                //on mobile device
                if (window.cordova) {
                    DB.connection = $cordovaSQLite.openDB({
                        name: 'mangi.db'
                    });
                }

                //open WebSQL database connection 
                else {
                    DB.connection = window.openDatabase('mangi', '1.0', 'Mangi POS', 4 * 1024 * 1024);
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

            return DB;
        });
}());