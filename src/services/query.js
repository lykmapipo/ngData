(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name Query
     * @description query builder based on squel
     * @see https://hiddentao.github.io/squel/
     */
    angular
        .module('ngData')
        .factory('Query', function($database, $q) {
            //create a local copy of squel
            //by cloning/copying a global squel
            var query = angular.copy(squel);

            //extending local squel with then executor
            query.cls.QueryBuilder.prototype.then = function(resolve, reject) {
                /*jshint validthis:true*/
                var self = this;

                //execute a current query
                var promise = $q(function(_resolve, _reject) {
                    //this refer to squel instance
                    $database.query(self.toString(), undefined)
                        .then(function(results) {
                            _resolve(results);
                        }).catch(function(error) {
                            _reject(error);
                        });
                });

                //return promise for resolution
                return promise.then(resolve, reject);

                /*jshint validthis:false*/
            };

            //export squel query builder
            return query;
        });
}());