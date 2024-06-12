//create web server
//load express module
var express = require('express');
var app = express();
var fs = require('fs');
//load body-parser module
var bodyParser = require('body-parser');
//load path module
var path = require('path');
//load mysql module
var mysql = require('mysql');

//create connection object
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "comments"
});

//connect to database
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//load body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set public folder as static folder for static file
app.use('/public', express.static(__dirname + '/public'));

//set route for index page
app.get('/', function(req, res) {
  var sql = "SELECT * FROM comments";
  con.query(sql, function(err, result) {
    if (err) throw err;
    res.render('index', {result: result});
  });
});

//set route for insert data
app.post('/add', function(req, res) {
  var sql = "INSERT INTO comments (name, comment) VALUES ('" + req.body.name + "', '" + req.body.comment + "')";
  con.query(sql, function(err, result) {
    if (err) throw err;
    res.redirect('/');
  });
});

//set route for delete data
app.get('/delete/:id', function(req, res) {
  var sql = "DELETE FROM comments WHERE id=" + req.params.id;
  con.query(sql, function(err, result) {
    if (err) throw err;
    res.redirect('/');
  });
});

//set route for edit data
app.get('/edit/:id', function(req, res) {
  var sql = "SELECT * FROM comments WHERE id=" + req.params.id;
  con.query(sql, function(err, result) {
    if (err) throw err;
    res.render('edit', {result: result});
  });
});

//set route for update data
app.post('/update/:id', function(req, res) {
  var sql = "UPDATE comments SET name='" + req.body.name + "', comment='" + req.body.comment + "' WHERE id=" + req.params.id;});