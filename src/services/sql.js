(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name SQL
     * @description sql builder based on sql
     * @see https://hiddentao.github.io/sql/
     */
    angular
        .module('ngData')
        .factory('SQL', function($database) {
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

            //extend select with ability to pass array fields
            sql.cls.Select.prototype.columns = function(fields) {

                //is multiple field selection
                if (_.isArray(fields)) {
                    //iterate over all fields
                    _.forEach(fields, function(field) {
                        this.field(field);
                    });
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

                var promise = $database.query(sql).then();
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
             * @return {Object|Array}        [description]
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
             * @return {Object|Array}        [description]
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

            //export sql sql builder
            return sql;
        });
}());