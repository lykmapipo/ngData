(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.Model
     * @description model layer used in ngData
     */
    angular
        .module('ngData')
        .factory('Model', function(inflector) {

            /**
             * @description Model constructor
             */
            function Model(options) {
                this.name = options.name;
                
                this.tableName =
                    options.tableName ||
                    inflector.pluralize(options.name.toLowerCase());
            }

            //table back this model
            Model.prototype.tableName;

            //name of the model
            Model.prototype.name;


            /**
             * @description save the model instance into the database
             * @return {Promise}
             */
            Model.prototype.save = function() {

            };

            /**
             * @description remove the instance
             * @return {Promise}
             */
            Model.prototype.remove = function() {

            };

            /**
             * @description parse the object to String object
             * @return {Object} [String object]
             */
            Model.prototype.toString = function() {

                return null;
            };


            /**
             * @description return object representation of this model instance
             * @return {Object}
             */
            Model.prototype.toObject = function() {

            };

            /**
             * @description parse the model to JSON object
             * @return {Object} 
             */
            Model.prototype.toJSON = function() {

            };

            return Model;
        });
}());