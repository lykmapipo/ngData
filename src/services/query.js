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


            /**
             * @function
             * @description specifies the complementary comparison value for
             *               paths specified with where()
             * @param  {Object} val value to be used in equals
             * @return {Query}  an instance of Query
             * @example
             * @public 
             */
            Query.prototype.equals = function(val) {

                //prepare conditions for path val pair
                var conditions = {};
                if (this._path) {
                    conditions[this._path] = val;
                }

                //add conditions to current expression
                this.where(conditions);

                return this;
            };


            /**
             * @function
             * @description find documents
             * @param  {Object}   conditions valid mongodb query object
             * @param  {[Array|String]}   projections optional fields to return
             * @return {Query} an instance of Query
             * @example
             *     Customer.find({name:'john', age:{$gt:30}})
             *     or
             *     
             *     Customer.find({name:'john', age:{$gt:30}}, 'name,accounts')
             *
             * @public
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
             * @function
             * @description declares the query a findOne operation. 
             *              When executed, the first found document is returned
             * @param  {Object}   conditions   valid mongodb query object
             * @param  {Object}   projections optional fields to return
             * @return {Query}  an instance of Query
             * @example
             *     Customer.findOne({id:1},'name, code')
             * @public
             */
            Query.prototype.findOne = function(conditions, projections) {
                //set result size required
                this.single = true;

                //build and return query
                return this.find(conditions, projections).limit(1).offset(0);
            };


            /**
             * @function
             * @description specifies a 'greater than' query condition.
             *              When called with one argument, the most recent 
             *              path passed to where() is used.
             * @param  {String} [path] valid document path
             * @param  {Number} val value to be used in greater than condition
             * @return {Query}  an instance of Query
             * @example
             *     Customer.gt('age', 20)
             * or 
             *     Customer.where('age').gt(20) 
             *
             * @public
             */
            Query.prototype.gt = function(path, val) {

                //normalize arguments
                if (arguments.length === 1) {
                    val = path;
                    path = undefined;
                }

                //prepare conditions for path val pair
                var conditions = {};
                if ((path || this._path) && _.isNumber(val)) {
                    path = path || this._path;
                    conditions[path] = {
                        $gt: val
                    };
                }

                //add conditions to current expression
                this.where(conditions);

                return this;
            };


            /**
             * @function
             * @description specifies a 'greater than or equal' query condition.
             *              When called with one argument, the most recent 
             *              path passed to where() is used.
             * @param  {String} [path] valid document path
             * @param  {Number} val value to be used in greater than or equal condition
             * @return {Query}  an instance of Query
             * @example
             *     Customer.gte('age', 20)
             * or 
             *     Customer.where('age').gte(20) 
             *
             * @public
             */
            Query.prototype.gte = function(path, val) {

                //normalize arguments
                if (arguments.length === 1) {
                    val = path;
                    path = undefined;
                }

                //prepare conditions for path val pair
                var conditions = {};
                if ((path || this._path) && _.isNumber(val)) {
                    path = path || this._path;
                    conditions[path] = {
                        $gte: val
                    };
                }

                //add conditions to current expression
                this.where(conditions);

                return this;
            };


            /**
             * @function
             * @description specifies in query condition.
             *              When called with one argument, the most recent 
             *              path passed to where() is used.
             * @param  {String} [path] valid document path
             * @param  {Number} val value to be used in `in` condition
             * @return {Query}  an instance of Query
             * @example
             *     Customer.where('code').in(['22','44'])
             * or 
             *     Customer.in('code', ['22','44']) 
             *
             * @public
             */
            Query.prototype.in = function(path, val) {

                //normalize arguments
                if (arguments.length === 1) {
                    val = path;
                    path = undefined;
                }

                //prepare conditions for path val pair
                var conditions = {};
                if ((path || this._path) && _.isArray(val)) {
                    path = path || this._path;
                    conditions[path] = {
                        $in: val
                    };
                }

                //add conditions to current expression
                this.where(conditions);

                return this;
            };


            /**
             * @description specifies the maximum number of records the query
             *              will return can not be used with distinct
             * @param  {Number} val maximum number of document to return
             * @return {Query}  an instance of Query
             * @example
             *     query.limit(5)
             *
             * @public
             */
            Query.prototype.limit = function(val) {

                if (val && _.isNumber(val)) {
                    this.sql.limit(val);
                }

                return this;
            };


            /**
             * @function
             * @description specifies a 'less than' query condition.
             *              When called with one argument, the most recent 
             *              path passed to where() is used.
             * @param  {String} [path] valid document path
             * @param  {Number} val value to be used in less than condition
             * @return {Query}  an instance of Query
             * @example
             *     Customer.lt('age', 20)
             * or 
             *     Customer.where('age').lt(20) 
             *
             * @public
             */
            Query.prototype.lt = function(path, val) {

                //normalize arguments
                if (arguments.length === 1) {
                    val = path;
                    path = undefined;
                }

                //prepare conditions for path val pair
                var conditions = {};
                if ((path || this._path) && _.isNumber(val)) {
                    path = path || this._path;
                    conditions[path] = {
                        $lt: val
                    };
                }

                //add conditions to current expression
                this.where(conditions);

                return this;
            };


            /**
             * @function
             * @description specifies a 'less than or equal' query condition.
             *              When called with one argument, the most recent 
             *              path passed to where() is used.
             * @param  {String} [path] valid document path
             * @param  {Number} val value to be used in less than or equal condition
             * @return {Query}  an instance of Query
             * @example
             *     Customer.lte('age', 20)
             * or 
             *     Customer.where('age').lte(20) 
             *
             * @public
             */
            Query.prototype.lte = function(path, val) {

                //normalize arguments
                if (arguments.length === 1) {
                    val = path;
                    path = undefined;
                }

                //prepare conditions for path val pair
                var conditions = {};
                if ((path || this._path) && _.isNumber(val)) {
                    path = path || this._path;
                    conditions[path] = {
                        $lte: val
                    };
                }

                //add conditions to current expression
                this.where(conditions);

                return this;
            };


            /**
             * @function
             * @description specifies a 'not equal' query condition.
             *              When called with one argument, the most recent 
             *              path passed to where() is used.
             * @param  {String} [path] valid document path
             * @param  {Number} val value to be used in not equal condition
             * @return {Query}  an instance of Query
             * @example
             *     Customer.ne('age', 20)
             * or 
             *     Customer.where('age').ne(20) 
             *
             * @public
             */
            Query.prototype.ne = function(path, val) {

                //normalize arguments
                if (arguments.length === 1) {
                    val = path;
                    path = undefined;
                }

                //prepare conditions for path val pair
                var conditions = {};
                if ((path || this._path) && _.isNumber(val)) {
                    path = path || this._path;
                    conditions[path] = {
                        $ne: val
                    };
                }

                //add conditions to current expression
                this.where(conditions);

                return this;
            };


            /**
             * @function
             * @description specifies arguments for an $or condition
             * @param {Array<Object>} conditions array of conditions of valid 
             *                                   mongodb query object
             * @return {Query} an instance of query
             * @example
             *     query.or([{ color: 'green' }, { status: 'ok' }])
             * @public      
             */
            Query.prototype.or = function(conditions) {
                return this.where({
                    $or: conditions || []
                });
            };


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
             * @description specifies which document fields to include or
             *              exclude (also known as the query "projection")
             * @param  {(Object|String)} arg document field(s) to select
             * @return {Query}   an instance of Query
             * @example
             *     // include a and b, exclude other fields
             *     query.select('a b');
             *     query.select(['a', 'b']);
             *
             *     // exclude c and d, include other fields
             *     query.select('-c -d');
             *
             *     // or you may use object notation, useful when
             *     // you have keys already prefixed with a "-"
             *     query.select({ a: 1, b: 1 });
             *     query.select({ c: 0, d: 0 }); 
             *     
             * @public
             */
            Query.prototype.select = function(arg) {

                if (_.isString(arg) || _.isArray(arg)) {
                    this.find(arg);
                }

                return this;
            };


            /**
             * @function
             * @description specifies the number of documents to skip.
             * @param {Number} val
             * @return {Query} an instance of Query
             * @example
             *     query.offset(10)
             * or
             *     query.skip(10)
             * @public
             */
            Query.prototype.skip =
                Query.prototype.offset = function(val) {

                    if (val && _.isNumber(val)) {
                        this.sql.offset(val);
                    }

                    return this;

                };


            /**
             * @function
             * @description sets the sort order
             * @param  {(Object|String)} arg
             * @return {Query} an instance of Query
             * @example
             *     query.sort('name')
             *
             * or 
             *     query.sort({name: 'asc',age : 'desc'})
             *
             * @public
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
                            if (value === 'asc' || value === 1) {
                                this.sql.order(key, true);
                            } else if (value === 'desc' || value === -1) {
                                this.sql.order(key, false);
                            }

                        }.bind(this));
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
             * @description specifies a path for use with chaining.
             * @param  {String} [path] a valid document path
             * @param  {Number|String} [val] value to use in comparison
             * @return {Query}      
             * @example
             *     query.where({name:'john',age:20})
             *  or
             *      query.where('name','john')
             * or
             *     Customer.where({name:'john',age:{$gt:20})
             */
            Query.prototype.where = function(path, value) {
                if (!this.sql) {
                    this.find();
                }

                //build condition if both path and value provided
                if (path && _.isString(path) && value) {
                    //reference path for later use
                    this._path = path;

                    var condition = {};
                    condition[path] = value;
                    path = condition;
                }

                //reference path for later use
                else if (_.isString(path) && !value) {
                    this._path = path;
                }

                //continue build expression if path is condition object
                this.expression = $where(path, this.expression);

                return this;
            };


            //TODO implement aggregate queries
            //i.e the min, max, avg, sum


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