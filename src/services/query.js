(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.Query
     * @description query builder
     */
    angular
        .module('ngData')
        .factory('Query', function(SQL, $where, Model) {

            /**
             * @constructor
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

            //refernce to current sql query to be issued
            Query.prototype.sql;

            //reference to collection instatiating new query
            Query.prototype.collection;

            //referencing sql where clause
            Query.prototype.expression;

            Query.prototype.single = false;

            //specify where query has already been finalized
            Query.prototype._finalized = false;

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

            //commons

            /**
             * @function
             * @description specifies arguments for an $and condition
             * @param {Array<Object>} conditions array of conditions of valid 
             *                                   mongodb query object
             * @return {Query} an instance of query
             * @example
             *     query.and([{ color: 'green' }, { status: 'ok' }])
             * @public      
             */
            Query.prototype.and = function(conditions) {
                return this.where({
                    $and: conditions || []
                });
            };


            /**
             * @function
             * @description specifying this query as a count query
             * @param  {Object}   conditions valid mongodb query objecr
             * @return {Query}  an instance of Query
             * @public
             */
            Query.prototype.count = function(conditions) {

                this.where(conditions);

                //set count selections
                this.sql.field('COUNT(*)', 'count');

                //set query form
                this.query = 'count';

                return this;
            };


            /**
             * @description create a new doc in the database
             * @param  {doc} doc valid document to create
             * @return {Query} an instance of Query
             */
            Query.prototype.create = function(doc) {

                if (!this.sql && this.type === 'insert') {
                    this.sql = SQL.insert().into(this.collection.tableName);
                }

                this.sql.values(doc);

                return this;
            };


            /**
             * @function
             * @description declares or executes a distinct() operation
             * @param  {String} field valid document property
             * @param  {Object} [conditions] valid mongodb query object
             * @return {Query}    an instance of Query
             * @example
             *     query.distinct('name')
             *     query.distinct('name', {code:{$in:['11','22','33','44']}})
             * @public
             */
            Query.prototype.distinct = function(field, conditions) {

                this.where(conditions);

                this.sql.columns(field);

                this.sql.distinct();

                return this;
            };


            //finders


            /**
             * @description find documents
             * @param  {Object}   conditions valid mongodb query object
             * @param  {[Array|String]}   projections optional fields to return
             * @return {Query} an instance of Query
             * @example
             *     Customer
             *         .find({name:'john', age:{$gt:30}})
             *         .then(function(customers){
             *              ...
             *          })
             *          .catch(function(error){
             *              ...
             *          });
             *     or
             *     
             *     Customer
             *         .find({name:'john', age:{$gt:30}}, 'name,accounts')
             *         .then(function(customers){
             *             ...
             *         })
             *         .catch(function(error){
             *             ...
             *         });
             */
            Query.prototype.find = function(conditions, projections) {
                //harmonize arguments
                if (_.isArray(conditions) || _.isString(conditions)) {
                    projections = conditions;
                    conditions = undefined;
                }

                //build sql select dml if not exists
                if (!this.sql && this.type === 'select') {
                    this.sql = SQL.select().from(this.collection.tableName);
                }

                //set where clause conditions
                if (conditions && _.isPlainObject(conditions)) {
                    this.where(conditions);
                }

                //set fields to select
                if (projections) {
                    this.sql.columns(projections);
                }

                //set query form
                this.query = 'find';

                return this;
            };


            /**
             * @description find a single document using given conditions
             * @param  {Object}   conditions   valid mongodb query object
             * @param  {Object}   projections optional fields to return
             * @return {Promise}  an instance of promise
             * @example
             *     Customer
             *         .findOne({id:1},'name, code')
             *         .then(function(customer){
             *             ...
             *         })
             *         .catch(function(error){
             *             ...
             *         });           
             */
            Query.prototype.findOne = function(conditions, projections) {
                //set result size required
                this.single = true;

                //build and return query
                return this.find(conditions, projections).limit(1).offset(0);
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


            //removers


            /**
             * @function
             * @description declare and/or execute this query as a remove() operation
             * @param  {[type]} conditions valid mongodb query condition
             * @return {Query} an instance of Query
             */
            Query.prototype.remove = function(conditions) {

                if (!this.sql && this.type === 'delete') {
                    this.sql = SQL.delete().from(this.collection.tableName);
                }

                if (conditions && _.isPlainObject(conditions)) {
                    this.where(conditions);
                }

                return this;
            };


            /**
             * @function
             * @description declare and/or execute this query as an update() operation
             * @param  {[type]} conditions valid mongodb query condition
             * @param {Object} doc valid object to use in update
             * @return {Query} an instance of Query
             */
            Query.prototype.update = function(conditions, doc) {

                if (!this.sql && this.type === 'update') {
                    this.sql = SQL.update().table(this.collection.tableName);
                }

                //set conditions
                if (conditions && _.isPlainObject(conditions)) {
                    this.where(conditions);
                }

                //set values
                if (doc && _.isPlainObject(doc)) {
                    this.sql.sets(doc);
                }

                return this;
            };


            /**
             * @description specifies which document fields to include or
             *              exclude (also known as the query "projection")
             * @param  {(Object|String)} arg
             * @return {Query}   
             * @example
             *     Customer
             *         .select()
             * 
             *
             * or 
             *     Customer
             *         .select(['name','age'])
             */
            Query.prototype.select = function(arg) {
                // harmonize argument
                if (_.isString(arg) || _.isArray(arg)) {

                    return this.find(arg);
                }

                return this;
            };


            /**
             * @description specifies a path for use with chaining.
             * @param  {String} [path] a valid document path
             * @param  {Number|String} [val] value to use in comparison
             * @return {Query}      
             * @example
             *     Customer
             *         .find()
             *         .where({
             *                 name:'john',
             *                 age:20
             *               })
             *  or
             *      Customer
             *         .where('name','john')
             *
             * or
             *     Customer
             *         .select()
             *         .where({
             *                 name:'john',
             *                 age:{$gt:20}
             *                )
             */
            Query.prototype.where = function(path, value) {
                if (!this.sql) {
                    this.find();
                }

                //build condition if both path and value provided
                if (path && _.isString(path) && value) {
                    var condition = {};
                    condition[path] = value;
                    path = condition;
                }

                //reference path for later use
                else if (_.isString(path) && !value) {
                    this.path = path;
                }

                //continue build expression if path is condition object
                this.expression = $where(path, this.expression);

                return this;
            };


            /**
             * @description sets the sort order
             * @param  {(Object|String)} arg
             * @return {Query} 
             * @example
             *     Customer
             *         .select()
             *         .sort('name')
             *
             * or 
             *     Customer
             *         .select()
             *         .sort({
             *              name: 'asc',
             *              age : 'desc'
             *          })   
             */
            Query.prototype.sort =
                Query.prototype.order = function(arg) {
                    // check for arguments provided
                    for (var i = 0; i < arguments.length; i++) {
                        if (_.isString(arguments[i])) {

                            this.sql.order(arguments[i]);
                        }
                    }

                    if (_.isPlainObject(arg)) {

                        _.forEach(arg, function(value, key) {
                            // check for order by options
                            if (value === 'asc') {
                                this.sql.order(key, true);
                            } else if (value === 'desc' || value === -1) {
                                this.sql.order(key, false);
                            }

                        }.bind(this));
                    }

                    return this;
                };


            /**
             * @description specifies a 'greater than' query condition.
             * @param  {(String|Object)} path
             * @param  {Number} val
             * @return {Query}  
             * @example
             *     Customer
             *         .select()
             *         .where()
             *         .gt({
             *                 age:20,
             *                  height: 140
             *             })
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .gt('age',20)   
             */
            Query.prototype.gt = function(path, val) {

                // harmonize arguments
                if (_.isPlainObject(path) && !val) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' > ' + value);
                    }.bind(this));
                }

                //harmonize arguments
                if (_.isNumber(path)) {
                    val = path;
                }

                if (path && val) {
                    this.expression.and(path + ' > ' + val);
                }

                return this;
            };


            /**
             * @description specifies a 'greater or equal' query condition.
             * @param  {(String|Object)} path
             * @param  {Number} val
             * @return {Query}   
             *  @example
             *     Customer
             *         .select()
             *         .where()
             *         .gte({
             *                 age:20,
             *                  height: 140
             *             })
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .gte('age',20)
             */
            Query.prototype.gte = function(path, val) {

                // harmonize arguments
                if (_.isPlainObject(path) && !val) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' >= ' + value);
                    }.bind(this));
                }

                if (_.isNumber(path)) {
                    val = path;
                }

                if (path && val) {
                    this.expression.and(path + ' >= ' + val);
                }

                return this;
            };


            /**
             * @description specifies a 'less than' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}  
             * @example
             *     Customer
             *         .select()
             *         .where()
             *         .lt({
             *                 age:20,
             *                  height: 140
             *             })
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .lt('age',20)
             */

            Query.prototype.lt = function(path, val) {

                // harmonize arguments
                if (_.isPlainObject(path) && !val) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' < ' + value);
                    }.bind(this));
                }

                if (_.isNumber(path)) {
                    val = path;
                }

                if (path && val) {
                    this.expression.and(path + ' < ' + val);
                }

                return this;
            };


            /**
             * @description specifies a 'less or equal' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}  
             * @example
             *     Customer
             *         .select()
             *         .where()
             *         .lte({
             *                 age:20,
             *                  height: 140
             *             })
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .lte('age',20)
             */
            Query.prototype.lte = function(path, val) {

                // harmonize arguments
                if (_.isPlainObject(path) && !val) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' <= ' + value);
                    }.bind(this));
                }

                if (_.isNumber(path)) {
                    val = path;
                }

                if (path && val) {
                    this.expression.and(path + ' <= ' + val);
                }

                return this;
            };


            /**
             * @description specifies a 'in' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}  
             * @example
             * Customer
             *         .select()
             *         .where()
             *         .in({city: ['mbeya', 'arusha', 'singida']})
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .in({city: ['mbeya', 'arusha', 'singida']}, 5)
             */
            Query.prototype.in = function(path, val) {

                if (path) {

                    _.forIn(path, function(value, key) {
                        // string that contains the values 
                        var values = '( ';

                        if (_.isArray(value)) {

                            for (var i = 0; i < value.length; i++) {

                                if (i < value.length - 1) {
                                    values += ('\"' + value[i] + '\"' + ',');
                                } else {
                                    values += ('\"' + value[i] + '\"' + ' )');
                                }
                            }
                            this.expression.and(key + ' IN ' + values);
                        }


                    }.bind(this));
                }

                if (_.isNumber(val)) {

                    this.sql.limit(val);
                }

                return this;
            };


            /**
             * @description specifies arguments for an $or condition.
             * @param  {Array} array
             * @return {Query}  
             */
            Query.prototype.or = function() {

                /* jshint camelcase: false*/
                this.expression.or_begin();
                /*jshint camelcase: true*/

                return this;
            };


            /**
             * @description specifies arguments for an $nor condition.
             * @param  {Array} array
             * @return {Query} 
             */
            Query.prototype.nor = function( /*array*/ ) {

            };


            /**
             * @description specifies the complementary comparison value for
             *               paths specified with where()
             * @param {String} path
             * @param  {Object} val
             * @return {Query}  
             * @example
             *     Customer
             *         .select()
             *         .where()
             *         .equals({age:20, height: 140})
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .equals('age', 20)  
             *  
             */
            Query.prototype.equals = function(path, val) {

                if (_.isString(path) && val) {
                    this.expression.and([path, '=', '?'].join(' '), val);
                }

                if (_.isPlainObject(path)) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and([key, '=', '?'].join(' '), value);
                    }.bind(this));
                }

                return this;
            };


            /**
             * @description specifies arguments for not equal query condition
             * @param  {String} path 
             * @param  {Number} val 
             * @return {Query}  
             * @example
             *     Customer
             *         .select()
             *         .where()
             *         .ne({
             *                 age:20,
             *                  height: 140
             *             })
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .ne('age',20)
             */
            Query.prototype.ne = function(path, val) {
                //harmonize arguments
                if (_.isNumber(path)) {
                    val = path;
                    path = undefined;
                }

                if (path && val) {
                    this.expression.and(path + ' <> ' + val);
                }

                if (_.isPlainObject(path) && !val) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' <> ' + value);
                    }.bind(this));
                }

                return this;
            };


            /**
             * @description specifies the maximum number of records the query
             *              will return. can not be used with distinct
             * @param  {Number} val [description]
             * @return {Query}  
             * @example
             *     Customer
             *         .select()
             *         .limit(5)
             *
             */
            Query.prototype.limit = function(val) {

                if (val && _.isNumber(val)) {

                    this.sql.limit(val);
                }

                return this;
            };


            /**
             * @description specifies an $exists condition
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}      
             */
            Query.prototype.exists = function( /*path, val*/ ) {

            };

            //TODO implement the min,max, avg, sum

            /**
             * @description specifies the number of documents to skip.
             * @param {Number} val
             * @return {Query} 
             * @example
             *     Customer
             *         .select()
             *         .offset(10)
             *
             */
            Query.prototype.offset =
                Query.prototype.skip = function(val) {

                    if (val && _.isNumber(val)) {

                        this.sql.offset(val);
                    }

                    return this;

                };


            /**
             * @description Executes this query and resolve with a promise
             * @return {promise}
             */
            Query.prototype.then = function( /*resolve, reject*/ ) {
                //finalize query
                this.finalize();

                var type = this.type;
                var query = this.query;
                var single = this.single;
                var collection = this.collection;

                var promise = this.sql.then();

                //TODO check query type
                //select,create,delete,upate
                promise = promise.then(function(result) {
                    //handle select query
                    if (type === 'select') {

                        result = SQL.fetchAll(result);

                        result = result || [];

                        //return data
                        if (result && query === 'find') {

                            //map results to model
                            result = _.map(result, function(instance) {
                                return new Model(collection, instance);
                            });

                            //compact result
                            result = _.compact(result);

                            if (single) {
                                result = _.first(result);
                            }

                        }

                        //return other result types
                        else {
                            result = _.first(result);
                        }

                    }

                    if (type === 'insert') {
                        result = result.insertId;
                    }

                    return result;
                });

                promise = promise.then.apply(promise, arguments);

                return promise;
            };


            /**
             * @description Executes this query and reject with a promise
             * @return {promise}
             */
            Query.prototype.catch = function( /*reject*/ ) {
                this.finalize();

                var promise = this.then();
                promise = promise.catch.apply(promise, arguments);

                return promise;
            };


            Query.prototype.finalize = function() {

                // check the expession condition if is still open
                // and query has not been finalize
                // otherwise finalize query expression
                if (this.expression && !this._finalized) {
                    this.sql.where(this.expression);
                    this._finalized = true;
                }

                return this;
            };


            /**
             * @description convert current query into its string presentation
             * @return {String} current query as sql DML 
             */
            Query.prototype.toString = function() {

                this.finalize();

                return this.sql.toString();
            };

            return Query;
        });
}());