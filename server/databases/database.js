const {Pool} = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "A123#",
    host: "localhost", 
    port: 5432,
    database: "login_system"
})

// // Create the users database
// const createTblQry = `CREATE TABLE users(
// user_id serial PRIMARY KEY,
// email VARCHAR (80) UNIQUE NOT NULL,
// firstName VARCHAR (50) NOT NULL,
// lastName VARCHAR (50),
// password VARCHAR (250) NOT NULL);`


// pool.query(createTblQry).then((res) => {
//     console.log("Table Created")
//     console.log(res)
// })
// .catch( (err) => {
//     console.log(err);
// })

module.exports = pool;