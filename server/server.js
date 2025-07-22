const express = require('express');
const sql3 = require('sqlite3').verbose()
const mime = require('mime-types');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn } = require('child_process');
const open = require('open');
const csv = require('csv-parser');
const fs = require('fs')
const __PORT__ = 9000;
const app = express();
app.use(express.static('public'));
app.use(express.static('public/Login&SignUp/'))
app.use(express.static('public/home_page/'));
app.use(express.static('public/feature_analysis'))
app.use(express.static('public/prediction_page/'));
app.use(express.static('public/stress_management/'));
app.use(express.static('/public/plot/'))

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const filePath = path.join(__dirname, 'public', req.url);
  const contentType = mime.lookup(filePath);
  if (contentType === 'text/css') {
    res.setHeader('Content-Type', contentType);
  }
  next();
});
let input_obj = undefined
const server = app.listen(__PORT__, () => {
  console.log('----------------------------------------------------')
  console.log(`Server listening on port ${__PORT__}`);
  open(`http://localhost:${__PORT__}`);
});
//-----------------------------------SERVER ENDPOINTS---------------------------------------------------------------


app.post('/register',async (req,res) => {
  console.log('-----------at /register route -------------');
  let jdata = req.body
  console.log('Data Received')
  let db = new sql3.Database('./project.db')
  let values = [jdata['username'].trim(),jdata['email'].trim(),jdata['gender'],jdata['password']]
  insertIntoTable(db,'mytable',values).then((out) => {
    if(out ==='User added successfully'){
      console.log('User added successfully')
      res.json({'data' : out});
    }
    else{
      console.log(out);
      res.json({'data' : out})
    }
  }).catch((err) => {
    console.log(err)
  })
})
app.post('/login',async (req,res) => {
  console.log('----------at /login route ----------------');
  let jdata = req.body;
  let db = new sql3.Database('./project.db')
  verify(jdata['username'].trim(),jdata['password']).then((out) => {
    if(out === 'Login Success'){
      console.log('Login Success')
      //res.json({'data' : out})
      open(`http://localhost:${__PORT__}/home_page/index.html`)
    }
    else{
      res.json({'data':out})
      console.log(out)
    }
    })
    .catch((err) => {
    console.log(err)

  })
})
app.post('/submit', async (req, res) => {
  try {
    input_obj = req.body
    console.log('----------------------------------------------------')
    console.log(input_obj)
    res.json({'res':'Data submitted successfully'});
  } catch (err) {
    console.error(err);
    //res.sendStatus(500).send('Error saving data to file');
  }
});
// Define the route to run the model
app.post('/run-python-script', async (req, res) => {

  const python_process = spawn('python', ['./py_fileIO.py',JSON.stringify(input_obj)]);
  console.log('running python script');
  new Promise((resolve, reject) => {
    let pdata=""
    python_process.stdout.on('data',(data)=>{
      pdata+=data
    })
    python_process.on('exit', (code) => {
      if (code === 0) {
        console.log(pdata)
        res.json({'outputValue': pdata})
        resolve();
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
  console.log('python script execution complete');
  console.log('----------------------------------------------------')
});
const cache={}
app.get('/dataset',(req,res) =>{
  if (cache.dataset) {
    // If the data is already cached, return it from the cache
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cache.dataset));
  } else{
  console.log('Request for dataset')
  const results = [];

  fs.createReadStream('../Dataset/newdf.csv')
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
      // Send the data as a JSON response to the client
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results));
    });
    console.log('dataset sent successfully')

  }
  });
  app.get('/cm',(req,res) => {
    console.log('Entered /cm route')
    data = fs.readFileSync('./confusion_matrix.txt','utf-8')
      const matrix = data.split('\n').map(row => row.split(',').map(Number));
      res.end(JSON.stringify(matrix))
      console.log('Data sent successfully')

    });

//-----------------------------------------------DATABASE HANDLER FUNCTIONS-------------------------------------

async function createDB(path = './', dbname = 'mydb.db') {
  return new sql3.Database(path + '/' + dbname);
}

async function createTable(db, tableName = 'mytable', columns = []) {
  try {
    if (columns.length === 0) {
      throw new Error('Columns cannot be empty');
    }
    let query = `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY, `;
    query += columns.map((cols) => `${cols.name} ${cols.type}`).join(', ');
    query += ')';
    db.run(query, (err) => {
      if (err) {
        throw new Error(err.message);
      } else {
        console.log('Table created successfully');
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function insertIntoTable(db, tableName, values) {
  try {
    let userExists = await checkUser(db, tableName, values[0]);
    let emailExists = await checkEmail(db,tableName,values[1]);
    return new Promise((resolve, reject) => {
    if (!userExists && !emailExists) {
        db.run(`INSERT INTO ${tableName} ('username','email','gender','password')  VALUES (?,?,?,?)`, values, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve('User added successfully');
          }
        });
    } else {
      if(userExists) resolve('User Already Exists')
      if(emailExists) resolve('The email is already in use')
    }
   });
  } catch (error) {
    throw error;
  }
}
async function checkEmail(db,tableName,email){
  return new Promise((resolve,reject) => {
      db.get(`SELECT email FROM ${tableName} WHERE email=?`,[email],(err,row) => {
        if(err){
          reject(err)
        }else{
          if(row){
            resolve(true)
          }else{
            resolve(false)
          }
        }
      });
  });
}
async function selectAll(db, tableName = 'mytable') {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        console.log(rows);
        resolve(rows);
      }
    });
  });
}

async function deleteRow(db, tableName = 'mytable', rowName = '', rowValue = '') {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM ${tableName} WHERE ${rowName}=?`, [rowValue], (err) => {
      if (err) {
        reject(err.message);
      } else {
        console.log(`Row(s) deleted ${this.changes}`);
        resolve(this.changes);
      }
    });
  });
}

async function getTableSchema(db, tableName) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT sql FROM sqlite_master WHERE name='${tableName}'`, function (err, row) {
      if (err) {
        reject(err.message);
      } else {
        resolve(row);
      }
    });
  });
}

async function dropTable(db, tableName) {
  return new Promise((resolve, reject) => {
    db.run(`DROP TABLE ${tableName}`, (err) => {
      if (err) {
        reject(err.message);
      } else {
        console.log('Table deleted');
        resolve(true);
      }
    });
  });
}

// Create table
let columns = [
  { name: 'username', type: 'text' },
  { name: 'password', type: 'text' }
];
//await createTable(db, 'mytable', columns);

async function checkUser(db, tableName, username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT username from ${tableName} WHERE username=?`, [username], (err, row) => {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        if (row) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
}

function verify(username, password) {
  //console.log(username,password)
  return new Promise((resolve, reject) => {
    const db = new sql3.Database('./project.db', (err) => {
      if (err) {
        reject(err);
      }
    });
    const query = `SELECT * FROM mytable WHERE username = ?`;
    db.get(query, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        if (row.password === password) {
          resolve('Login Success')
        } else {
          resolve('Invalid Password');
        }
      } else {
        resolve('User not found');
      }
    });
    db.close();
  });
}
//-----------------------------------------------------------------------------------------------------------------
/*
app.post('/register', async (req, res) => {
  console.log('in REGISTER\n-------------------------------------------')
  const py = spawn('python',['./register.py',JSON.stringify(req.body)])
  try {
     new Promise((resolve,reject) => {
      let stdout = "";
      py.stdout.on('data',(data) => {
        stdout += data;
      });
      py.on('close',(code) => {
        if(code === 0){
          console.log("Python script register.py exited with code 0");
          console.log("Python script output:");
          console.log(stdout);
          res.json({'data' : stdout})  
          resolve()
        }else{
          reject(new Error(`Python script exited with code ${code}`));
        }
      })
    })
  } catch (err) {
    console.error(err);
  }
});

app.post('/login', async (req, res) => {
  console.log('in LOGIN\n--------------------------------------------')
  const py = spawn('python',['./login.py',JSON.stringify(req.body)])
  try {
      await new Promise((resolve,reject) => {
      let stdout = "";
      py.stdout.on('data',(data) => {
        stdout += data;
      });
      py.on('close',(code) => {
        if(code === 0){
          console.log("Python script login.py exited with code 0");
          console.log("Python script output:");
          console.log(stdout);
          res.json({'data':stdout})
          if(stdout.trim() === 'Login Success'){
            res.sendFile(__dirname + '/public/home_page/index.html')
            open(`http://localhost:${__PORT__}/home_page/index.html`)
          }
          resolve()
        }else{
          reject(new Error(`Python script exited with code ${code}`));
        }
      })
    })
  } catch (err) {
    console.error(err);
  }
});

*/