/**
 * @description Simple and minimal WebSQL and cordova SQLite ORM for ionic and angular
 * @version v0.2.0 - Tue Dec 08 2015 16:32:40
 * @link https://github.com/lykmapipo/ngData
 * @authors lykmapipo <lallyelias87@gmail.com>, BenMaruchu <https://github.com/BenMaruchu>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData
     * @description Simple and minimal WebSQL and cordova SQLite ORM 
     *              for ionic and angular
     */
    angular
        .module('ngData', [
            'platanus.inflector'
        ]);

}());


(function() {
    'use strict';

    /**
     * @ngdoc constant
     * @name ngDataTypes
     * @description common data types that can be used in WebSQL and SQLite
     *              and their corresponding JS types.
     */
    angular
        .module('ngData')
        .constant('DataTypes', {
            //map for JS to SQL data types

            //string datatypes
            'String': 'TEXT',

            //integer data types
            'Boolean': 'INTEGER',

            //real data types
            'Number': 'REAL',
            'Integer': 'INTEGER',

            //text data types
            'Date': 'TEXT',

            'Object': 'TEXT',
            'Function': 'TEXT',
            'Array': 'TEXT',
            'Int8Array': 'TEXT',
            'Uint8Array': 'TEXT',
            'Uint8ClampedArray': 'TEXT',
            'Int16Array': 'TEXT',
            'Uint16Array': 'TEXT',
            'Int32Array': 'TEXT',
            'Uint32Array': 'TEXT',
            'Float32Array': 'TEXT',
            'Float64Array': 'TEXT',

            'Blob': 'BLOB'

            //if data type is missed default to TEXT
        });
}());

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

            //database properties
            self.name = 'db';
            self.description = 'Database';
            self.version = '1.0.0';
            self.size = 4 * 1024 * 1024;

            //database connection reference
            self.connection = null;

            //provider implementation
            self.$get = ['$q', '$window', function($q, $window) {
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
            }];
            /*jshint validthis:false*/
        });
}());

(function() {
    'use strict';

    /**
     * the documentation in this factory was borrowed from mongoose api
     */
    angular
        .module('ngData')
        .factory('Collection', ['$q', 'inflector', '$validate', 'Model', 'Query', function($q, inflector, $validate, Model, Query) {

            /**
             * @description Collection
             * @param {Object} options
             */
            function Collection(options) {
                this.name = options.name;

                this.tableName =
                    options.tableName ||
                    inflector.pluralize(options.name.toLowerCase());

                this.definition = options;

                this.properties = this.definition.properties;

                //initialize collection
                this._init();
            }

            //table back this collection
            Collection.prototype.tableName;

            //name of collection
            Collection.prototype.name;

            //collection definition/schema
            Collection.prototype.definition;

            //collection properties
            Collection.prototype.properties;


            /**
             * @function
             * @description collection initialization logics
             * @private
             */
            Collection.prototype._init = function() {

                //deduce if collection use autoIncrement primary key
                var id = this.properties.id;
                this.autoPK = id && id.autoIncrement;

                //bind collection methods
                if (this.definition.statics) {
                    _.forEach(this.definition.statics, function(value, key) {
                        // extend collection with statics methods
                        this[key] = value;
                    }.bind(this));
                }

            };


            /**
             * @function
             * @description initialize new model without persist it
             * @return {Object}      new model instance
             * @public
             */
            Collection.prototype.new = function(values) {
                //instantiate new model
                var model = new Model(this, values);

                //return model instance
                return model;
            };


            /**
             * @function
             * @description counts number of matching documents in a database 
             *              collection
             * @param  {Object} conditions valid mongodb query object
             * @return {Query}            an instance of Query
             * @public
             */
            Collection.prototype.count = function(conditions) {

                var query = new Query({
                    collection: this,
                    type: 'select'
                });

                query = query.count(conditions);

                return query;
            };


            /**
             * @function
             * @description shortcut for creating a new document(s) that is 
             *              automatically saved to the database if valid.
             * @param {Object|Array<Object>} doc(s)
             * @return {Promise} that will eventually resolve with newly created
             *                        document
             *
             * @public
             */
            Collection.prototype.create = function(doc) {

                //check for batch create
                if (_.isArray(doc)) {

                    var queries = _.map(doc, function(_doc_) {
                        return this.create(_doc_);
                    }.bind(this));

                    return $q.all(_.compact(queries));
                }

                //create single document
                else {

                    //TODO validate doc before save
                    var query = new Query({
                        collection: this,
                        type: 'insert'
                    });

                    query = query.create(doc);

                    query = query.then(function(id) {
                        //extend model with the returned id
                        //if autoIncrement primary key is used
                        if (this.autoPK) {
                            doc.id = id;
                        }

                        return new Model(this, doc);

                    }.bind(this));

                    return query;
                }
            };


            /**
             * @function
             * @description creates a Query for a distinct operation
             * @param  {String} field valid document property
             * @param  {Object} [conditions] valid mongodb query object
             * @return {Query}    an instance of Query
             * @public
             */
            Collection.prototype.distinct = function(field, conditions) {

                var query = new Query({
                    collection: this,
                    type: 'select'
                });

                query = query.distinct(field, conditions);

                return query;
            };


            /**
             * @function
             * @description find documents using specified conditions
             * @param  {Object}   conditions valid mongodb query object
             * @param  {[Array|String]}   projections optional fields to return
             * @return {Query} an instnce of Query
             * @public
             */
            Collection.prototype.find = function(conditions, projections) {

                var query = new Query({
                    collection: this,
                    type: 'select'
                });

                query = query.find(conditions, projections);

                return query;
            };


            /**
             * @function
             * @description find a single document by its id
             * @param  {String|Number}   id document id
             * @param  {[Array|String]}   projections optional fields to return
             * @return {Query} an instance of Query
             * @public
             */
            Collection.prototype.findById = function(id, projections) {

                var query = new Query({
                    collection: this,
                    type: 'select'
                });

                query = query.findOne({
                    id: id
                }, projections);

                return query;
            };


            /**
             * @function
             * @description find a single document using specified conditiond
             * @param  {Object}   conditions valid mongodb query object
             * @param  {[Array|String]}   projections optional fields to return
             * @return {Query} an instance of Query
             * @public
             */
            Collection.prototype.findOne = function(conditions, projections) {

                var query = new Query({
                    collection: this,
                    type: 'select'
                });

                query = query.findOne(conditions, projections);

                return query;
            };


            /**
             * @function
             * @description removes documents from the collection.
             * @param  {Object}   conditions valid mongodb query object
             * @return {Promise} that will eventually resolved with full raw 
             *                        response response from database
             *
             * @public
             */
            Collection.prototype.remove = function(conditions) {

                var query = new Query({
                    collection: this,
                    type: 'delete'
                });

                query = query.remove(conditions);

                return query;
            };


            /**
             * @function
             * @description updates documents in the database 
             *              without returning them.
             * @param  {Object}   conditions valid mongodb query object
             * @param  {Object}   doc value to set to all matched documents
             * @return {Promise} that will eventually resolved with full raw 
             *                        response response from database
             *
             * @public
             */
            Collection.prototype.update = function(conditions, doc) {

                var query = new Query({
                    collection: this,
                    type: 'update'
                });

                //set update conditions and fields
                query = query.update(conditions, doc);

                return query;
            };


            /**
             * @function
             * @description executes registered validation rules on the provided
             *              document
             * @return {Object} a document if valid
             * @public
             */
            Collection.prototype.validate = function(doc) {
                var constraints = {};

                var asObject = doc;

                if (this.autoPK) {
                    asObject = _.omit(asObject, 'id');
                }

                //build constraints
                _.forEach(_.keys(asObject), function(key) {
                    //obtain attribute definition from collection
                    //properties
                    var attribute = this.properties[key];

                    //pick only validation definition
                    constraints[key] = _.pick(attribute, $validate.validators);

                }.bind(this));

                return $validate
                    .async(doc, constraints)
                    .then(function( /*object*/ ) {
                        return doc;
                    });
            };

            /**
             * @description creates a Query, applies the passed conditions, 
             *              and returns the Query
             * @param  {String} [path] a valid document path
             * @param  {Number|String} [val] value to use in comparison
             * @return {Query}  an instance of Query
             */
            Collection.prototype.where = function(path, val) {

                var query = new Query({
                    collection: this,
                    type: 'select'
                }).find();

                //set update conditions and fields
                query = query.where(path, val);

                return query;
            };


            return Collection;
        }]);
}());

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.Model
     * @description model layer used in ngData
     */
    angular
        .module('ngData')
        .factory('Model', ['$validate', function($validate) {

            /**
             * @constructor
             * @param {Collection} collection valid ngData collection for this
             *                                model
             * @param {[Object]} values key value pair data to set into instance
             *                          properties
             */
            function Model(collection, values) {
                //reference to model collection
                this.collection = collection;

                this._init(values);
            }


            /**
             * @function
             * @description model initialization logics
             * @private
             */
            Model.prototype._init = function(values) {

                //initialize model properties
                //and set default properties
                _.forEach(_.keys(this.collection.properties), function(property) {

                    var value = _.get(this.collection.properties, property);

                    this[property] = value ? value.defaultsTo : undefined;

                }.bind(this));

                //bind collection instance methods
                if (this.collection.definition.methods) {
                    _.forEach(this.collection.definition.methods, function(value, key) {
                        // extend model with instance methods
                        this[key] = value;
                    }.bind(this));
                }


                //assign instance properties thier value
                if (values && _.isPlainObject(values)) {
                    _.forEach(values, function(value, key) {
                        if (_.has(this.collection.properties, key)) {
                            this[key] = value;
                        }
                    }.bind(this));
                }

            };


            /**
             * @function
             * @description check whether this model has not been persisted 
             *              into the database
             * @return {Boolean}
             * @public
             */
            Model.prototype.isNew = function() {
                //TODO update logics to check for new model instance
                return !this.id;
            };


            /**
             * @description save the model instance into the database
             * @return {Promise}
             */
            Model.prototype.save = function() {

                var self = this;
                var query;
                var asObject;

                //create if new
                if (this.isNew()) {
                    asObject = this.toObject();

                    if (this.collection.autoPK) {
                        asObject = _.omit(asObject, 'id');
                    }

                    query = this.collection.create(asObject);
                }

                //else update
                else {

                    asObject = _.omit(this.toObject(), 'id');

                    query = this.collection.update({
                            id: this.id
                        }, asObject)
                        .then(function( /*response*/ ) {
                            return self;
                        });
                }

                return query;

            };


            /**
             * @description remove the instance
             * @return {Promise}
             */
            Model.prototype.remove = function() {
                var self = this;

                var query = this.collection.remove({
                    id: this.id
                }).then(function( /*response*/ ) {
                    return self;
                });

                return query;
            };


            /**
             * @description return object representation of this model instance
             * @return {Object}
             */
            Model.prototype.toObject =
                Model.prototype.valueOf = function() {
                    var toObject =
                        _.pick(this, _.keys(this.collection.properties));

                    return toObject;
                };


            /**
             * @description return json representation of a model instance
             * @return {Object}
             */
            Model.prototype.toJSON = function() {
                return this.toObject();
            };


            /**
             * @function
             * @description executes registered validation rules for this document
             * @return {Model} an instance of Model
             * @public
             */
            Model.prototype.validate = function() {

                var constraints = {};

                var asObject = this.toObject();

                if (this.collection.autoPK) {
                    asObject = _.omit(asObject, 'id');
                }

                //build constraints
                _.forEach(_.keys(asObject), function(key) {
                    //obtain attribute definition from collection
                    //properties
                    var attribute = this.collection.properties[key];

                    //pick only validation definition
                    constraints[key] = _.pick(attribute, $validate.validators);

                }.bind(this));

                return $validate
                    .async(this.toObject(), constraints)
                    .then(function( /*object*/ ) {
                        return this;
                    }.bind(this));
            };

            return Model;
        }]);
}());

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.$ngData
     * @description `$ngData` object that will be used across an
     *              application
     *
     * @example <caption>registering a new model</caption>
     * angular
     *  .module('<moduleName>')
     *  .run(function($ngData) {
     *      //create $ngData model
     *      var Customer = $ngData.model('Customer',{
     *              tableName:'customers',
     *              timestamp:true,
     *              properties:{
     *                  name:{
     *                      type:String,
     *                      presence:true
     *                  },
     *                  code:String,
     *                  email:{
     *                      type:String,
     *                      email:true,
     *                      presence:true
     *                  },
     *                  joinedAt:{
     *                      type:Date,
     *                      defaultsTo: new Date()
     *                  }
     *              },
     *              methods:{//instance methods
     *                  getCodedName:function(){
     *                      return [this.code,this.name].join('-');
     *                  }
     *              },
     *              statics:{//static methods
     *                  findByCode:function(code){
     *                      return this.findOne({code:code})
     *                  }
     *              }
     *          });
     *  })
     *  .factory('Customer', function($ngData){
     *      //return created model or extend it
     *      return $ngData.model('Customer');
     *  });
     *
     * @public
     */
    angular
        .module('ngData')
        .factory('$ngData', ['Collection', 'Schema', '$q', function(Collection, Schema, $q) {
            var $ngData = {};

            //models map registry
            $ngData.models = {};


            /**
             * @description register a new model into ngData and compile it
             * @param  {String} name       name of the model
             * @param  {Object} definition model definition
             * @return {Object}            valid ngData model
             */
            $ngData.model = function(name, definition) {
                //check if model alreay exist
                var model = _.get($ngData.models, name);
                if (model && !definition) {
                    return model;
                }

                //compile a model definition
                //and register it
                else {
                    //extend definition with model name
                    definition.name = name;

                    //add id property if not exists
                    definition.properties =
                        _.merge({
                            id: {
                                type: Number,
                                autoIncrement: true
                            }
                        }, definition.properties);

                    //instantiate a collection with definetion
                    $ngData.models[name] = new Collection(definition);

                    return _.get($ngData.models, name);
                }
            };


            /**
             * @description initialize ngData
             */
            $ngData.initialize = function() {
                //1. scan for models

                //2. apply migration
                var migrations =
                    _.map(_.values($ngData.models), function(collection) {
                        return Schema.alter(
                            collection.tableName,
                            collection.properties
                        );
                    });

                return $q.all(migrations);

            };


            //export $ngData factory
            return $ngData;
        }]);
}());

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.Query
     * @description query builder
     */
    angular
        .module('ngData')
        .factory('Query', ['SQL', '$where', 'Model', function(SQL, $where, Model) {

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
             * @public
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
             * @function
             * @description specifies a path for use with chaining.
             * @param  {String} [path] a valid document path
             * @param  {Number|String} [val] value to use in comparison
             * @return {Query}  an instance of Query    
             * @example
             *     query.where({name:'john',age:20})
             *  or
             *      query.where('name','john')
             * or
             *     Customer.where({name:'john',age:{$gt:20})
             *
             * @public
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
             * @function
             * @description Executes this query and resolve with a promise
             * @return {Promise} an instance of Promise
             * @public
             */
            Query.prototype.then = function( /*resolve, reject*/ ) {
                //finalize query
                this.finalize();

                var promise = this.sql.then();

                //TODO check query type
                //select,create,delete,upate
                promise = promise.then(function(result) {
                    //handle select query
                    if (this.type === 'select') {

                        result = SQL.fetchAll(result);

                        result = result || [];

                        //return data
                        if (result && this.query === 'find') {

                            //map results to model
                            result = _.map(result, function(instance) {
                                return new Model(this.collection, instance);
                            }.bind(this));

                            //compact result
                            result = _.compact(result);

                            if (this.single) {
                                result = _.first(result);
                            }

                        }

                        //return other result types
                        else {
                            result = _.first(result);
                        }

                    }

                    if (this.type === 'insert') {
                        result = result.insertId;
                    }

                    return result;

                }.bind(this));

                promise = promise.then.apply(promise, arguments);

                return promise;
            };


            /**
             * @function
             * @description Executes this query and reject with a promise
             * @return {Promise} an instance of Query
             * @public
             */
            Query.prototype.catch = function( /*reject*/ ) {
                this.finalize();

                var promise = this.then();
                promise = promise.catch.apply(promise, arguments);

                return promise;
            };


            /**
             * @function
             * @description finalize query DML
             * @return {Query} an instance of Query
             * @private 
             */
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
             * @function
             * @description convert current query into its string presentation
             * @return {String} current query as sql DML 
             * @public
             */
            Query.prototype.toString = function() {

                this.finalize();

                return this.sql.toString();
            };

            return Query;
        }]);
}());

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name Schema
     * @description schema utilities and builder
     */
    angular
        .module('ngData')
        .factory('Schema', ['$q', 'DataTypes', '$database', 'SQL', function($q, DataTypes, $database, SQL) {

            //reference schema factory
            var Schema = {};


            /**
             * @function
             * @description cast JS data types to respective SQLite3/WebSQL
             *              data types
             * @param {String|Constructor} type valid JS type constructor or name
             * @return {String} valid SQL type or default to TEXT if non found
             * @private
             * @see DataTypes
             * @example
             *         Number will be converted to REAL
             *         String will be converted to TEXT
             *         etc
             */
            Schema.castToSQLType = function(type) {
                type = type.name || type;
                return _.get(DataTypes, type, 'TEXT');
            };


            /**
             * @description normalize given property to use object property 
             *              definition
             * @param  {Object|String} property        property definition
             * @param  {Object} properties schema properties definition
             * @return {Object}            normalized property definition
             * @example
             *         This property definition
             *         {
             *             name: String
             *         }
             *
             *         Will be normalized to
             *         {
             *             name:{
             *                 type:String
             *             }
             *         }
             */
            Schema.normalizeProperty = function(property, properties) {
                var _property = {};
                if (!_.isPlainObject(properties[property])) {
                    _property.type = properties[property];
                } else {
                    _property = properties[property];
                }
                return _property;
            };


            /**
             * @function
             * @description build SQL columns DDL definition from schema properties
             * @param  {Object} properties valid JSON schema properties
             * @return {String}     valid SQL DDL
             * @private
             * @example
             *         The following schema properties definition
             *         {
             *           firstName: {
             *               type: String,
             *               unique: true,
             *               defaultsTo: 'Doe'
             *           },
             *           lastName: {
             *               type: String
             *           },
             *           ssn: {
             *               type: String,
             *               primaryKey: true,
             *               index: true
             *           }
             *          }
             *          
             *          Will get converted to the following SQL
             *          'firstName TEXT UNIQUE DEFAULT Doe, lastName TEXT, ssn TEXT PRIMARY KEY'
             */
            Schema.propertiesDDL = function(properties) {
                var ddl = '';

                // iterate properties and
                // build SQL DDL per each property
                _.keys(properties).forEach(function(key /*property name*/ ) {
                    // normalize simple key/value property
                    // ex: name: 'string'
                    var property = Schema.normalizeProperty(key, properties);

                    // check if property support autoincrement
                    // and default it to primary key
                    if (property.autoIncrement) {
                        property.type = 'Integer';
                        property.primaryKey = true;
                    }

                    var str = [
                        key, // property name
                        Schema.castToSQLType(property.type), // property type
                        property.primaryKey ? 'PRIMARY KEY' : '', // primary key
                        property.unique ? 'UNIQUE' : '', // unique constraint
                        property.defaultsTo ? 'DEFAULT "' + property.defaultsTo + '"' : ''
                    ].join(' ').trim().replace(/\s+/g, ' ');

                    ddl += str + ', ';
                });

                // Remove trailing seperator/trim
                return ddl.slice(0, -2);
            };


            /**
             * @function
             * @description build an index array from any properties that
             *              have an index key set.
             *
             * @return {Array} array of all indexed properties
             * @private
             */
            Schema.getIndexes = function(properties) {
                // iterate through the properties
                // and pull out any index property
                return _.compact(_.map(_.keys(properties), function(name) {
                    var property = _.get(properties, name);
                    if (_.has(property, 'index')) {
                        return name;
                    }
                }));

            };


            /**
             * @function
             * @description transform a JS type to corresponding SQL type
             * @param {Object} value value to be converted to SQL value
             * @return {Object} SQL value for the given JS value
             * @private
             */
            Schema.toSQLValue = function(value) {

                // cast dates to SQL date
                if (_.isDate(value)) {
                    value = value.toUTCString();
                }

                // cast functions to strings
                if (_.isFunction(value)) {
                    value = value.toString();
                }

                // cast Arrays as strings
                if (_.isArray(value) || _.isTypedArray(value)) {
                    value = JSON.stringify(value);
                }

                // stringify object value
                if (_.isPlainObject(value)) {
                    value = JSON.stringify(value);
                }

                //TODO add blob convertion support

                return value;
            };


            /**
             * @description create schema table
             * @param  {String} table      name of the table
             * @param  {Object} properties JSON schema
             * @return {Promise}
             */
            Schema.createTable = function(table, properties) {
                //TODO escape table name

                // iterate through each attribute, building a query string
                var _schema = Schema.propertiesDDL(properties);

                //Build query
                var query =
                    'CREATE TABLE IF NOT EXISTS ' + table + ' (' + _schema + ')';

                // run the query
                return $database.query(query);

            };


            /**
             * @description drop schema table
             * @param  {String} table      name of the table
             * @return {Promise}
             */
            Schema.dropTable = function(table) {
                //TODO escape table name

                //Build query
                var query =
                    'DROP TABLE IF EXISTS ' + table;

                // run the query
                return $database.query(query);

            };


            /**
             * @function
             * @description update existing data to comply with the new table structure
             * @param  {Array} data       current table data
             * @param  {Object} properties new JSON schema properties
             * @return {Array}
             * @private
             */
            Schema.copyData = function(data, properties) {
                return _.map(data, function(model) {
                    //prepare missing properties data
                    var missing = _.omit(properties, _.keys(model));
                    var additional = {};

                    _.keys(missing).forEach(function(key) {
                        //deduce JS data type
                        var property = Schema.normalizeProperty(key, properties);
                        var type =
                            (property.type.name || property.type) || 'String';

                        //obtain property default value
                        var defaultsTo = properties[key].defaultsTo;
                        switch (type) {
                            case 'String':
                                additional[key] = defaultsTo || '';
                                break;
                            case 'Boolean':
                                additional[key] = defaultsTo || true;
                                break;
                            case 'Number':
                                additional[key] = defaultsTo || 0;
                                break;
                            case 'Date':
                                additional[key] = defaultsTo || new Date();
                                break;
                            case 'Object':
                                additional[key] = defaultsTo || {};
                                break;
                            case 'Array':
                            case 'Int8Array':
                            case 'Uint8Array':
                            case 'Uint8ClampedArray':
                            case 'Int16Array':
                            case 'Uint16Array':
                            case 'Int32Array':
                            case 'Uint32Array':
                            case 'Float32Array':
                            case 'Float64Array':
                                additional[key] = defaultsTo || [];
                                break;
                            default:
                                additional[key] = '';
                                break;
                        }
                    });

                    //merge additional with original data
                    var data = _.merge(model, additional);

                    //remove unwanted properties
                    _.forEach(_.keys(data), function(key) {
                        if (!_.has(properties, key)) {
                            data = _.omit(data, key);
                        }
                    });

                    return data;
                });
            };


            /**
             * @description alter schema table structure in case of any changes
             * @param  {String} table      name of the table
             * @param  {Object} properties JSON schema
             * @return {Promise}
             */
            Schema.alter = function(table, properties) {
                var q = $q.defer();
                $database.connect();
                var con = $database.connection;

                //error processor
                var _error;

                function errorHandler(tx, error) {
                    var message = 'Fail to migrate ' + table;
                    message = error && error.message ? error.message : message;

                    _error = new Error(message);
                    return error;
                }

                //prepare schema DDL
                var columns = Schema.propertiesDDL(properties);

                //queries
                var dropTable =
                    'DROP TABLE IF EXISTS "' + table + '"';

                var createTable =
                    'CREATE TABLE IF NOT EXISTS "' + table + '" (' + columns + ')';

                var selectData = 'SELECT * FROM "' + table + '"';

                con.transaction(
                    //perform table schema upgrade under transaction
                    function(tx) {
                        // try to create table if not exists
                        tx.executeSql(createTable, [], function(tx1 /*,result*/ ) {

                            //select data from existing table
                            tx1.executeSql(selectData, [], function(tx2, result) {

                                //dump existing data
                                var all = SQL.fetchAll(result);
                                var dumps = Schema.copyData(all, properties);

                                //drop existing table
                                tx2.executeSql(dropTable, [], function(tx3 /*,result*/ ) {

                                    //create newly table
                                    tx3.executeSql(createTable, [], function(tx4 /*, result*/ ) {

                                        //re-insert dump                                           
                                        _.forEach(dumps, function(model) {
                                            if (_.isPlainObject(model)) {
                                                var query =
                                                    SQL.insert()
                                                    .into(table)
                                                    .values(model).toString();

                                                tx4.executeSql(query);
                                            }

                                        });

                                        //resolve
                                        if (_error) {
                                            q.reject(_error);
                                        } else {
                                            q.resolve(table + ' migrated successfully');
                                        }

                                    }, errorHandler); //tx3
                                }, errorHandler); //tx2
                            }, errorHandler); //tx1
                        }, errorHandler); //tx
                    },

                    //handle transaction error
                    function(tx, error) {
                        if (!_error) {
                            errorHandler(error);
                        }
                        q.reject(_error);
                    });

                return q.promise;
            };

            return Schema;
        }]);

}());

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name SQL
     * @description sql builder based on sql
     * @see https://hiddentao.github.io/squel/
     */
    angular
        .module('ngData')
        .factory('SQL', ['$database', function($database) {
            //create a local copy of squel
            //by cloning/copying a global squel
            var sql = _.clone(squel);


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


            //extend update set to support object values
            sql.cls.Update.prototype.sets = function(field, value) {

                if (_.isPlainObject(field)) {
                    this.setFields(field);
                } else if (field && value) {
                    this.set(field, value);
                }

                return this;
            };


            //extend select with ability to pass array fields
            sql.cls.Select.prototype.columns = function(fields) {
                //normalize columns to select
                if (!_.isArray(fields) && _.isString(fields)) {
                    fields = fields.split(' ');
                }

                //iterate over all fields
                _.forEach(fields, function(field) {
                    this.field(field);
                }.bind(this));

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
             * @return {Object|Array}
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
             * @return {Object|Array}
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
        }]);
}());

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name validate
     * @description object validation based on validatejs
     * @see https://github.com/ansman/validate.js
     */
    angular
        .module('ngData')
        .factory('$validate', ['$q', function($q) {

            //set $q as validatejs promise
            validate.Promise = function(fn) {
                return $q(fn);
            };

            //create a local copy of validatejs
            //by cloning/copying a global validate
            var $validate = _.clone(validate);


            //available validators
            $validate.validators = [
                'date', 'datetime', 'email', 'equality',
                'exclusion', 'format', 'inclusion', 'length',
                'numericality', 'presence', 'url'
            ];

            //export sql validate
            return $validate;
        }]);
}());

(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.$where
     * @description build where conditions from mongodb query object
     * @return {Function} condition builder function that is build the 
     * the sql condition expression and return it
     */

    angular
        .module('ngData')
        .factory('$where', ['SQL', function(SQL) {

            function buildSQLCondition(joiner, condition, key, value) {
                //this refer to expression context
                /*jshint validthis:true*/
                var expr = [
                    key,
                    '=',
                    '?'
                ];

                //harminize condition joiner
                //default to and
                joiner = joiner || 'and';

                //obtain condition function
                var fn = this[joiner];

                //handel gt
                if (condition === '$gt') {
                    expr[1] = '>';
                    expr = expr.join(' ');
                    fn.call(this, expr, value);
                }

                //handle gte
                else if (condition === '$gte') {
                    expr[1] = '>=';
                    expr = expr.join(' ');
                    fn.call(this, expr, value);
                }

                //handle lt
                else if (condition === '$lt') {
                    expr[1] = '<';
                    expr = expr.join(' ');
                    fn.call(this, expr, value);
                }

                //handle lte
                else if (condition === '$lte') {
                    expr[1] = '<=';
                    expr = expr.join(' ');
                    fn.call(this, expr, value);
                }

                //handle ne
                else if (condition === '$ne') {
                    expr[1] = '<>';
                    expr = expr.join(' ');
                    fn.call(this, expr, value);
                }

                //handle eq
                else if (condition === '$eq') {
                    expr[1] = '=';
                    expr = expr.join(' ');
                    fn.call(this, expr, value);
                }

                //handle in
                else if (condition === '$in') {

                    if (!_.isArray(value)) {
                        value = [value];
                    }

                    value = _.map(value, function(val) {
                        //handle string type value
                        if (_.isString(val)) {
                            return ['\'', val, '\''].join('');
                        }

                        //handle number type value
                        else {
                            return val;
                        }
                    }).join(',');

                    value = ['(', value, ')'].join('');

                    fn.call(this, key + ' IN ' + value);
                }
            }


            /**
             * @description build sql condition from given condition and joiner
             * @param  {Object} conditions a valid condition object
             * @param  {String} joiner valid query join string
             * @return {Object} an sql expression
             */
            function _where(expression, conditions, joiner) {

                if (conditions && _.isPlainObject(conditions)) {

                    _.forEach(conditions, function(value, key) {
                        // if it is a plain object 
                        // look inside for key value
                        if (_.isPlainObject(value)) {
                            _.forEach(value, function(val, condition) {
                                buildSQLCondition.call(expression, joiner, condition, key, val);
                            });
                        }

                        //else handle primitive values to object
                        else {
                            //prepare condition expression
                            var expr = [
                                key,
                                '=',
                                '?'
                            ].join(' ');

                            if (joiner === 'or') {
                                expression.or(expr, value);
                            } else {
                                expression.and(expr, value);
                            }
                        }

                    });

                }
            }


            /**
             * @description convert SQL query from mongodb query object
             * @param  {Object} conditions
             */
            function $where(expression, conditions) {
                // default expression joiner
                var joiner = 'and';

                // enclosing parenthes in order to obey algebra's laws
                var orEnclose = false;
                var andEnclose = false;

                if (_.has(conditions, '$and') || _.has(conditions, '$or')) {

                    _.forEach(conditions, function(value, key) {
                        if (key === '$and' || key === '$or') {
                            //iterate over the objects in the value array

                            if (_.has(conditions, '$and') && _.keysIn(conditions).length > 1) {
                                andEnclose = true;
                            }

                            if (_.has(conditions, '$or') && _.keysIn(conditions).length > 1) {
                                orEnclose = true;
                            }

                            /*jshint camelcase: false*/
                            if (orEnclose) {
                                expression.or_begin();
                            }

                            if (andEnclose) {
                                expression.and_begin();
                            }

                            /* jshint camelcase: true*/
                            _.forEach(value, function(val) {
                                //check if the inner objects are still joiners
                                if (_.has(val, '$and') || _.has(val, '$or')) {

                                    _.forEach(val, function(v, k) {
                                        if (k === '$and') {
                                            /*jshint camelcase: false*/
                                            expression.or_begin();
                                            /* jshint camelcase: true*/
                                            _.forEach(v, function(obj) {
                                                _where(expression, obj);
                                            });
                                            expression.end();

                                        } else if (k === '$or') {
                                            joiner = 'or';
                                            /*jshint camelcase: false*/
                                            expression.and_begin();
                                            /* jshint camelcase: true*/
                                            _.forEach(v, function(obj) {
                                                _where(expression, obj, joiner);
                                            });
                                            expression.end();
                                        } else {
                                            joiner = 'and';
                                            var conditionObject = {};
                                            conditionObject[k] = v;
                                            _where(expression, conditionObject, joiner);
                                        }
                                    });


                                } else if (key === '$or') {
                                    joiner = 'or';
                                    _where(expression, val, joiner);
                                } else {
                                    _where(expression, val);
                                }
                            });

                            // close the parenthes for the conditons
                            if (orEnclose || andEnclose) {
                                expression.end();
                            }

                        } else {
                            //harmonize primitive types to object
                            var conditionObject = {};
                            conditionObject[key] = value;
                            _where(expression, conditionObject);
                        }
                    });
                }
                //continue with simple conditions
                else {
                    _where(expression, conditions);
                }
            }


            /**
             * @description convert mongodb query object to SQL query
             * @param  {Object} conditions valid mongodb query object
             * @param  {[Object]} expression an instance squell expression
             * @return {Object} an instance of squel expression
             */
            function where(conditions, expression) {

                expression = expression || SQL.expr();

                $where(expression, conditions);

                return expression;
            }

            return where;
        }]);

}());