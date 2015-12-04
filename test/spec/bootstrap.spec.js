// 'use strict';


// before(function(done) {
//     this.timeout = function() {
//         return 10000;
//     };

//     var db = window.openDatabase('db', 'Database', '1.0.0', 4 * 1024 * 1024);

//     //clean up database
//     db.transaction(function(tx) {
//         tx.executeSql('DROP TABLE IF EXISTS customers', [], function(tx, result) {
//             done(null, result);
//         }, function(tx, error) {
//             done(error);
//         });
//     });

// });