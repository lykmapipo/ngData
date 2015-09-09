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
        .factory('Query', function($database) {
            //create a local copy of squel
            //by cloning/copying a global squel
            var query = angular.copy(squel);

            //extend insert queries with `values(Array|Object)` builder
            query.cls.Insert.prototype.values = function(values) {
                //this refer to insert query context
                if (_.isArray(values)) {
                    this.setFieldsRows(values);
                } else {
                    this.setFields(values);
                }
                return this;
            };

            //extending local squel with then executor
            query.cls.QueryBuilder.prototype.then = function( /*resolve, reject*/ ) {
                var self = this;

                var promise = $database.query(self.toString(), undefined).then();
                promise = promise.then.apply(promise, arguments);
                return promise;
            };

            //extending local squel with catch executor
            query.cls.QueryBuilder.prototype.catch = function( /*reject*/ ) {
                var promise = this.then();
                promise = promise.catch.apply(promise, arguments);
                return promise;
            };

            //export squel query builder
            return query;
        });
}());