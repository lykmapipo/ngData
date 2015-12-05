(function() {
    'use strict';

    /**
     * the documentation in this factory was borrowed from mongoose api
     */
    angular
        .module('ngData')
        .factory('Collection', function($q, inflector, Model, Query) {

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
             * @description initialize new model without persist it
             * @return {Object}      new model instance
             */
            Collection.prototype.new = function(values) {
                //instantiate new model
                var model = new Model(this, values);

                //return model instance
                return model;
            };


            /**
             * @description shortcut for creating a new document that is
             *              automatically saved to the database if valid.
             * @param {Object} doc
             * @return {type}
             */
            Collection.prototype.create = function(doc) {

                //TODO validate doc before save
                //TODO check if id is autoIncrement
                var query = new Query({
                    collection: this,
                    type: 'insert'
                });

                query = query.create(doc);

                query = query.then(function(id) {
                    //extend model with the returned id
                    if (this.autoPK) {
                        doc.id = id;
                    }

                    return new Model(this, doc);

                }.bind(this));


                //TODO batch create 
                //TODO execute creates in parallel

                //TODO execute query
                //TODO fetch created model if primary key is auto increment

                return query;
            };


            /**
             * @description Updates documents in the database without
             *              returning them.
             * @param  {Object}   conditions
             * @param  {Object}   doc
             * @param  {Object}   options
             * @param  {Function} callback
             */
            Collection.prototype.update = function(conditions, doc) {

                var query = new Query({
                    collection: this,
                    type: 'update'
                });

                //set update conditions and fields
                query = query.update(conditions, doc);

                //TODO return updated instances after execution

                return query;
            };


            /**
             * @description removes documents from the collection.
             * @param  {[Object]}   conditions
             * @return {Promise} which resolve with collection of models instance
             *                         removed
             */
            Collection.prototype.remove = function(conditions) {

                // var find = this.find(conditions);

                var remove = new Query({
                    collection: this,
                    type: 'delete'
                }).remove(conditions);

                //find documents and then delete
                // return find.then(function(instances) {
                //     return remove.then(function( response ) {
                //         return instances;
                //     });
                // });
                return remove;
            };


            //finders


            /**
             * @description find documents using specified conditions
             * @param  {Object}   conditions valid mongodb query object
             * @param  {[Array|String]}   projections optional fields to return
             * @return {Promise} which resolve with collection of models instance
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
             * @description find a single document using specified conditiond
             * @param  {Object}   conditions valid mongodb query object
             * @param  {[Array|String]}   projections optional fields to return
             * @return {Promise} which resolve with model instance
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
             * @description find a single document by its id
             * @param  {String|Number}   id document id
             * @param  {[Array|String]}   projections optional fields to return
             * @return {Promise} which resolve with model instance
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


            return Collection;
        });
}());