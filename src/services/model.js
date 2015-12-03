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
            function Model(properties) {
                if (properties) {
                    this.properties = properties;
                }
                //initialize model
                this._init();
            }

            
            /**
             * @description initial model
             * @private
             */
            Model.prototype._init = function() {
                _.forEach(_.keys(this.properties), function(property) {

                    this[property] =
                        _.get(this.properties, property).defaultsTo;

                }.bind(this));
            };


            //model properties
            Model.prototype.properties;


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
            Model.prototype.toObject =
                Model.prototype.valueOf = function() {
                    return _.pick(this, _.keys(this.properties));
                };

            
            /**
             * @description return json representation of a model instance
             * @return {Object}
             */
            Model.prototype.toJSON = function() {
                return this.toObject();
            };

            return Model;
        });
}());
