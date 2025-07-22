const s = require('sqlite3')
let db = new s.Database('./project.db')
function drop(name){
    db.run('DROP TABLE '+name,(err)=>console.log(err))
}
db.run('CREATE TABLE IF NOT EXISTS mytable(id INTEGER PRIMARY KEY,username text NOT NULL,email text NOT NULL,gender text NOT NULL,password text NOT NULL)',(err)=>console.log(err))
function sall(db){
    db.all('SELECT * FROM mytable',(er,r)=>{
        if(er) console.error(er)
        console.log(r)
    })
}
db.close()