const db = require('quick.db');

db.fetchAll().then(databases => {
  console.log(`GamingBot se ha iniciado con ${databases.length} bases de datos preexistentes. Un árbol de bases de datos será impreso.`);
  console.log('json.sqlite');
  databases.forEach(function(database){
    console.log(`| +-- ${database.ID}`);
    console.log(`| | +-- ${JSON.stringify(database)}`);
  })
})
