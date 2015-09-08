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

            //extend insert queries with `values(Array|Object)` builder
            query.cls.Insert.prototype.values = function(values) {
                //this refer to insert query context
                if (angular.isArray(values)) {
                    this.setFieldsRows(values);
                } else {
                    this.setFields(values);
                }
                return this;
            };

            //extending local squel with then executor
            query.cls.QueryBuilder.prototype.then = function( /*resolve, reject*/ ) {
                /*jshint validthis:true*/
                var self = this;

                var then = $database.query(self.toString(), undefined).then();
                then = then['then'].apply(then, arguments);
                return then;

                /*jshint validthis:false*/
            };

            //extending local squel with catch executor
            query.cls.QueryBuilder.prototype.catch = function() {
                var then = this.then();
                then = then['catch'].apply(then, arguments);
                return then;
            };

            //export squel query builder
            return query;
        });
}());