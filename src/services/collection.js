(function() {
    'use strict';

    /**
     * the documentation in this factory was borrowed from mongoose api
     */
    angular
        .module('ngData')
        .factory('Collection', function($q, inflector, $validate, Model, Query) {

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
                });

                //set update conditions and fields
                query = query.where(path, val);

                return query;
            };


            return Collection;
        });
}());