const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup SQLite
const DBSOURCE = "db.sqlite";
const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, email TEXT UNIQUE, phone TEXT, roll TEXT, password TEXT, role TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, date TEXT, time TEXT, location TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, file_path TEXT, comment TEXT, created_at TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, note TEXT, reminder TEXT, created_at TEXT
  )`);
});

// Simple auth routes
app.post('/api/auth/register', (req, res) => {
  const {name,email,phone,roll,password,role} = req.body;
  const sql = 'INSERT INTO users (name,email,phone,roll,password,role) VALUES (?,?,?,?,?,?)';
  db.run(sql, [name,email,phone,roll,password,role], function(err){
    if(err) return res.status(400).json({error: err.message});
    res.json({message: 'Registered', userId: this.lastID});
  });
});

app.post('/api/auth/login', (req, res) => {
  const {email,password} = req.body;
  const sql = 'SELECT id,name,email,role FROM users WHERE email=? AND password=?';
  db.get(sql, [email,password], (err,row) => {
    if(err) return res.status(500).json({error: err.message});
    if(!row) return res.status(401).json({error:'Invalid credentials'});
    res.json({message:'Login success', user: row});
  });
});

// Attendance
app.post('/api/attendance/mark', (req, res) => {
  const {user_id,date,time,location} = req.body;
  const sql = 'INSERT INTO attendance (user_id,date,time,location) VALUES (?,?,?,?)';
  db.run(sql,[user_id,date,time,location], function(err){
    if(err) return res.status(400).json({error: err.message});
    res.json({message:'Attendance marked', id: this.lastID});
  });
});

app.get('/api/attendance/user/:user_id', (req, res) => {
  const uid = req.params.user_id;
  const sql = 'SELECT * FROM attendance WHERE user_id = ? ORDER BY id DESC';
  db.all(sql, [uid], (err, rows) => {
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// Multer setup for assignment uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.post('/api/assignments/upload', upload.single('file'), (req,res) => {
  const {user_id, comment} = req.body;
  const filePath = req.file ? '/uploads/' + req.file.filename : null;
  const created_at = new Date().toISOString();
  const sql = 'INSERT INTO assignments (user_id,file_path,comment,created_at) VALUES (?,?,?,?)';
  db.run(sql, [user_id,filePath,comment,created_at], function(err){
    if(err) return res.status(400).json({error: err.message});
    res.json({message:'Uploaded', id: this.lastID, file: filePath});
  });
});

app.get('/api/assignments/user/:user_id', (req,res) => {
  const uid = req.params.user_id;
  const sql = 'SELECT * FROM assignments WHERE user_id = ? ORDER BY id DESC';
  db.all(sql, [uid], (err, rows) => {
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// Notes
app.post('/api/notes/add', (req,res) => {
  const {user_id,note,reminder} = req.body;
  const created_at = new Date().toISOString();
  const sql = 'INSERT INTO notes (user_id,note,reminder,created_at) VALUES (?,?,?,?)';
  db.run(sql,[user_id,note,reminder,created_at], function(err){
    if(err) return res.status(400).json({error: err.message});
    res.json({message:'Note saved', id: this.lastID});
  });
});

app.get('/api/notes/user/:user_id', (req,res) => {
  const uid = req.params.user_id;
  const sql = 'SELECT * FROM notes WHERE user_id = ? ORDER BY id DESC';
  db.all(sql, [uid], (err, rows) => {
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// Simple reports endpoint (attendance count)
app.get('/api/reports/attendance/:user_id', (req,res) => {
  const uid = req.params.user_id;
  const sql = 'SELECT date, time, location FROM attendance WHERE user_id = ? ORDER BY date DESC';
  db.all(sql, [uid], (err, rows) => {
    if(err) return res.status(500).json({error: err.message});
    res.json({attendance: rows});
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port', PORT));
