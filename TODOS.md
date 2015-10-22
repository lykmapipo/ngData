# Initialization
- [ ] Allow auto migration
- [ ] Allow turn-off auto migration
- [ ] Allow logging of sql queries

# Casting
- [ ] cast data to db type when inserting
- [ ] cast data to js type when fetch from db

# Queries

```js
var db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
      db.transaction(function (tx) {
         tx.executeSql('DROP TABLE IF EXISTS foo');
         tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)');
         tx.executeSql('INSERT INTO foo (id, text) VALUES (?, ?)', [1, 'synergies']);
         tx.executeSql('SELECT * from foo', [], function(tx, result) {
            alert('id = ' + result.rows.item(0).id + ', text = ' + result.rows.item(0).text)
         });
      });

SELECT * FROM sqlite_master WHERE type='table' AND name='books';
```

```js
con
                    .transaction(function(tx) {
                            // drop temporary table if exists
                            tx.executeSql(drtt, [], function(tx /*, r1*/ ) {
                                // create temporary table
                                tx.executeSql(ret, [], function(tx /*, r2*/ ) {
                                    //re-create table based on new schema
                                    tx.executeSql(crt, [], function(tx /*, r3*/ ) {
                                        //select data from temporary table
                                        tx.executeSql(sftt, [], function(tx, r4) {
                                            //copy data if exist
                                            var data = SQL.fetchAll(r4);

                                            //prepare data
                                            data = Schema.copyData(data, properties);


                                            //execute all inserts
                                            _.forEach(data, function(model) {
                                                var query = SQL.insert().into(table).values(model).toString();
                                                tx.executeSql(query, angular.noop, errorHandler);
                                            });

                                            q.resolve(data);

                                        }, errorHandler);
                                    }, errorHandler);
                                }, errorHandler);
                            }, errorHandler);
                        },
                        function( /*tx, error*/ ) {
                            q.reject(_error);
                        });
```