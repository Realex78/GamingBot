const db = require('quick.db');

db.fetchAll().then(databases => {
  console.log(`Se han encontrado ${databases.length} bases de datos.`);

  databases.forEach(function(database){
    db.delete(database.ID).then(status => {
      if (status == true) console.log(`Se ha eliminado exitosamente ${database.ID}`);
      else console.log(`Hubo un error al tratar de eliminar ${database.ID}`);
    });
  })
})
