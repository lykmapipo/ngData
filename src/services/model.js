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
             * @constructor
             * @param {Collection} collection valid ngData collection for this
             *                                model
             * @param {[Object]} values key value pair data to set into instance
             *                          properties
             */
            function Model(collection, values) {
                //reference to model collection
                this.collection = collection;

                //initialize model properties
                //and set default properties
                _.forEach(_.keys(this.collection.properties), function(property) {

                    var value = _.get(this.properties, property);

                    this[property] = value ? value.defaultsTo : undefined;

                }.bind(this));

                //assign instance properties thier value
                if (values && _.isPlainObject(values)) {
                    _.forEach(values, function(value, key) {
                        if (_.has(this, key)) {
                            this[key] = value;
                        }
                    }.bind(this));
                }
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