(function() {
    'use strict';

    /**
     * the documentation in this factory was borrowed from mongoose api
     */
    angular
        .module('ngData')
        .factory('Collection', function(Model, inflector) {

            /**
             * @description Collection
             * @param {type} table [description]
             */
            function Collection(options) {
                this.name = options.name;

                this.tableName =
                    options.tableName ||
                    inflector.pluralize(options.name.toLowerCase());

                this.definition = options;
            }

            //table back this collection
            Collection.prototype.tableName;

            //name of collection
            Collection.prototype.name;

            //model definition
            Collection.prototype.definition;


            /**
             * @description Shortcut for creating a new Document that is
             *              automatically saved to the db if valid.
             * @param {(Object|Array)} doc
             * @param {Function} callback
             * @return {type}
             */
            Collection.prototype.create = function( /*doc, callback*/ ) {

            };

            /**
             * @description Updates documents in the database without
             *              returning them.
             * @param  {Object}   conditions
             * @param  {Object}   doc
             * @param  {Object}   options
             * @param  {Function} callback
             */
            Collection.prototype.update = function( /*conditions, doc, options, callback*/ ) {

            };

            /**
             * @description Removes documents from the collection.
             * @param  {Object}   conditions
             * @param  {Function} callback
             * @return {type}
             */
            Collection.prototype.remove = function( /*conditions, callback*/ ) {

            };

            return Collection;
        });
}());