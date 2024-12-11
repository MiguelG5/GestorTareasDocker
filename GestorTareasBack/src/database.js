const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPASSWD,
  port: process.env.PGPORT,
});
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error al conectar a la base de datos", err);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

module.exports = pool;
