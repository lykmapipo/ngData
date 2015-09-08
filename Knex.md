# Connection
```js
var knex = Knex({
    client:'websql',
    name:'db',
    version:'1.0.0',
    displayName:'Knex db',
    estimatedSize: 5 * 1024 * 1024,
    pool:{
        min:2,
        max:10
    }
});
```

## Providers
- [ ] $databaseProvider 
- [ ] $migrationProvider
- [ ] $seedProvider