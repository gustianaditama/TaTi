const mysql = require('mysql2/promise')

const db = mysql.createPool({
    host : 'localhost',
    user : 'root',
    database : 'project'
})

db.query('select 1 + 1 as result', (err, res) =>{
    if(err){
        console.log(err)
    }else{
        console.log('connected to database')
    }
})

module.exports = db