(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.Model
     * @description model layer used in ngData
     */
    angular
        .module('ngData')
        .factory('Model', function() {

            /**
             * @description Model constructor
             */
            function Model() {

            }


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