(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name Collection
     * @description
     */
    angular
        .module('ngData')
        .factory('Collection', function($q, inflector, $validate, Model) {

            /**
             * @description Collection
             * @param {Object} options
             */
            function Collection(options) {

                //TODO make use of inflector tableize
                options.tableName =
                    options.tableName ||
                    inflector.pluralize(options.collectionName.toLowerCase());

                this.definition = options;

                //initialize collection
                this._init();
            }


            //backing database table
            Collection.prototype.table;


            /**
             * @function
             * @description collection initialization logics
             * @private
             */
            Collection.prototype._init = function() {

                //add magic getter
                var properties =
                    _.keys(_.omit(this.definition, ['methods', 'statics']));

                _.forEach(properties, function(property) {

                    Object.defineProperty(this, property, {
                        get: function() {
                            return this.definition[property];
                        }.bind(this)
                    });

                }.bind(this));

                //TODO cleanup auto primary key
                //deduce if collection use autoIncrement primary key
                // var id = this.properties.id;
                // this.autoPK = id && id.autoIncrement;

                //bind collection methods
                if (this.definition.statics) {
                    _.forEach(this.definition.statics, function(value, key) {
                        // extend collection with statics methods
                        this[key] = value;
                    }.bind(this));
                }

            };


            /**
             * @name toSchema
             * @description convert collection definition to lovefield schema
             * @param  {SchemaBuilder} schemaBuilder valid lovefield schema builder
             * @return {SchemaBuilder}               valid lovefield schema builder
             * @type {Function}
             */
            Collection.prototype.toSchema = function(schemaBuilder) {
                //create table
                var table = schemaBuilder.createTable(this.tableName);

                //add columns
                _.forEach(this.properties, function(def, property) {
                    //TODO convert JS type to lovefield type

                    //add column
                    table.addColumn(property, def.type.lf);

                    //add index if set
                    if (def && (def.index || def.unique)) {
                        var index = ['idx', property].join('_');
                        var isUnique = def.unique || false;
                        table.addIndex(index, [property], isUnique);
                    }


                    //TODO add primary key
                    //TODO add auto increment primary key
                });

                return schemaBuilder;
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


            //TODO return lovefield migration definition for the collection

            return Collection;
        });
}());