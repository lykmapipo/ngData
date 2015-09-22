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
        .factory('Query', function(SQL) {

            /**
             * @description Query functional constructor
             * @param {Object} options 
             */
            function Query(options) {
                // harmonize options
                options = _.merge({
                    type: 'select'
                }, options);

                if (options.collection) {
                    this.collection = options.collection;
                }

                this.type = options.type;

                this._init();

            }

            Query.prototype.sql;

            Query.prototype.collection;

            Query.prototype._init = function() {
                //instantiate SQL
                this.sql = SQL[this.type]();

                //set a table to use
                switch (this.type) {
                    case 'select':
                        this.sql.from(this.collection.tableName);
                        break;
                    case 'update':
                        this.sql.table(this.collection.tableName);
                        break;
                    case 'insert':
                        this.sql.into(this.collection.tableName);
                        break;
                    case 'delete':
                        this.sql.from(this.collection.tableName);
                        break;
                }
            };


            /**
             * @description find documents
             * @param  {Object}   conditions
             * @param  {Array}   projections [optional fields to return]
             * @param  {Object}   options     [optional]
             * @param  {Function} callback
             * @return {Query}
             */
            Query.prototype.find = function(conditions, projections /*options*/ ) {
                //harmonize argumets
                if (_.isArray(conditions) || _.isString(conditions)) {
                    projections = conditions;
                    conditions = undefined;
                }

                if (!this.sql && this.type === 'select') {
                    this.sql = SQL.select().from(this.collection.tableName);
                }

                if (projections) {
                    this.sql.columns(projections);
                }

                return this;
            };


            /**
             * @description Finds a single document by its _id field.
             *              findById(id) is equivalent to findOne({ id: id }).
             * @param  {(Object|String|Number)}   id     value of `id` to query by
             * @param  {Object}   projections optional fields to return
             * @param  {Object}   options     [optional]
             * @param  {Function} callback
             * @return {Query}               
             */
            Query.prototype.findById = function(id, projections, options) {
                return this.find({
                    id: id
                }, projections, options);
            };

            /**
             * @description Issue a mongodb findAndModify remove command by a
             *               document's _id field. findByIdAndRemove(id, ...) is
             *               equivalent to findOneAndRemove({ id: id }, ...).
             * @param  {(Object|String|Number)}   id      value of `id` to query by
             * @param  {Object}   options
             * @return {Query}            
             */
            Query.prototype.findByIdAndDelete = function( /*id, options*/ ) {

            };

            /**
             * @description Issues a mongodb findAndModify update command by a
             *              document's id field. findByIdAndUpdate(id, ...) is
             *              equivalent to findOneAndUpdate({ id: id }, ...).
             * @param  {Object}   id       value of `id` to query by
             * @param  {Object}   update
             * @param  {Object}   options
             * @return {Query}            
             */
            Query.prototype.findByIdAndUpdate = function( /*id, update, options*/ ) {

            };

            /**
             * @description Find One document
             * @param  {Object}   conditions
             * @param  {Object}   projections [ optional fields to return ]
             * @param  {Object}   options
             * @return {Query}               
             */
            Query.prototype.findOne = function( /*conditions, projections, options*/ ) {

            };

            /**
             * @description Issue a findAndModify remove command
             * @param  {Object}   conditions
             * @param  {Object}   options
             * @param  {Function} callback
             * @return {Query}              
             */
            Query.prototype.findOneAndRemove = function( /*conditions, options*/ ) {

            };

            /**
             * @description Issues a mongodb findAndModify update command.
             * @param  {Object}   conditions
             * @param  {Object}   update
             * @param  {Object}   options
             * @return {Query}    
             */
            Query.prototype.findOneAndUpdate = function( /*conditions, update, options*/ ) {

            };

            /**
             * @description Specify the 'where' query conditions
             * @param  {String} path
             * @param  {Object} val  [optional]
             * @return {Query}      
             */
            Query.prototype.where = function(path /*val*/ ) {

                if (path) {
                    if (typeof(path === 'string')) {
                        this.select = this.select.where(path);
                    }
                }

                return this;
            };

            /**
             * @description Specifies the maximum number of records the query
             *              will return. can not be used with distinct
             * @param  {Number} val [description]
             * @return {Query}     
             */
            Query.prototype.limit = function( /*val*/ ) {

            };

            /**
             * @description Sets the sort order
             * @param  {(Object|String)} arg [description]
             * @return {Query}    
             */
            Query.prototype.sort = function( /*arg*/ ) {

            };

            /**
             * @description Specifies a 'greater than' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}      
             */
            Query.prototype.gt = function( /*path, val*/ ) {

            };

            /**
             * @description Specifies a 'greater or equal' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}      
             */
            Query.prototype.gte = function( /*path, val*/ ) {

            };

            /**
             * @description Specifies a 'less than' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}      
             */
            Query.prototype.lt = function( /*path, val*/ ) {

            };

            /**
             * @description Specifies a 'less or equal' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}      
             */
            Query.prototype.lte = function( /*path, val*/ ) {

            };

            /**
             * @description Specifies a 'in' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}     
             */
            Query.prototype.in = function( /*path, val*/ ) {

            };

            /**
             * @description Specifies which document fields to include or
             *              exclude (also known as the query "projection")
             * @param  {(Object|String)} arg
             * @return {Query}   
             */
            Query.prototype.select = function( /*arg*/ ) {

            };

            /**
             * @description Specifies arguments for an $and condition.
             * @param  {Array} options
             * @return {Query}       
             */
            Query.prototype.and = function( /*options*/ ) {

            };

            /**
             * @description Specifies arguments for an $or condition.
             * @param  {Array} array
             * @return {Query}       
             */
            Query.prototype.or = function( /*array*/ ) {

            };

            /**
             * @description Specifies arguments for an $nor condition.
             * @param  {Array} array
             * @return {Query}       
             */
            Query.prototype.nor = function( /*array*/ ) {

            };

            /**
             * @description Specifying this query as a count query.
             * @param  {Object}   criteria
             * @return {Query} 
             */
            Query.prototype.count = function( /*criteria*/ ) {

            };

            /**
             * @description Declares or executes a distinct() operation.
             * @param  {String}   fields
             * @param  {(Object|Query)}   criteria
             * @return {Query}    
             */
            Query.prototype.distinct = function( /*fields, criteria*/ ) {

            };

            /**
             * @description Specifies the complementary comparison value for
             *               paths specified with where()
             * @param  {Object} val
             * @return {Query}     
             */
            Query.prototype.equals = function( /*val*/ ) {

            };

            /**
             * @description Specifies an $exists condition
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}      
             */
            Query.prototype.exists = function( /*path, val*/ ) {

            };

            /**
             * @description Executes this query and returns a promise
             * @return {promise}
             */
            Query.prototype.then = function() {

            };

            /**
             * @description Specifies the number of documents to skip.
             * @param {Number} val
             * @return {Query} 
             */
            Query.prototype.offset =
                Query.prototype.skip = function( /*val*/ ) {

                };

            /**
             * @description convert current query into its string presentation
             * @return {String} current query sql 
             */
            Query.prototype.toString = function() {
                //return current query sql
                return this.sql.toString();
            };

            return Query;
        });
}());
