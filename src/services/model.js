(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name ngData.Model
     * @description model layer used in ngData
     */
    angular
        .module('ngData')
        .factory('Model', function($validate) {

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

                    var value = _.get(this.collection.properties, property);

                    this[property] = value ? value.defaultsTo : undefined;

                }.bind(this));

                //assign instance properties thier value
                if (values && _.isPlainObject(values)) {
                    _.forEach(values, function(value, key) {
                        if (_.has(this.collection.properties, key)) {
                            this[key] = value;
                        }
                    }.bind(this));
                }
            }


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
             * @description Executes registered validation rules for this document.
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
        });
}());