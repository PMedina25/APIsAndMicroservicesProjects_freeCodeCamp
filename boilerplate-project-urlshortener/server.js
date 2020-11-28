'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

const dns = require('dns');

var cors = require('cors');

var app = express();

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration 
var port = process.env.PORT || 3000;

const Schema = mongoose.Schema;

const urlSchema = new Schema({
        originalURL: String,
        short_url: Number
      });

const Url = mongoose.model('Url', urlSchema);

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

// connect to our database
mongoose.connect('mongodb+srv://strider:qAFu0zifL1kPeqAv@cluster0.m9yxb.mongodb.net/freecodecamp?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true },  function (error) {
  // Do things once connected
  if (error) {
    console.log('Database error or database connection error ' + error);
  }
  console.log('Database state is ' + mongoose.connection.readyState);
});


/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post('/api/shorturl/new', (req, res, next) => {
  const originalURL = req.body.url;
  const urlObject = new URL(originalURL);

  dns.lookup(urlObject.hostname, (err, address, family) => {
    if (err) {
      res.json({
        "error": "Invalid URL"
      });
    }
    else {
      let shortenedURL = Math.floor(Math.random()*100000).toString();

      // create an object(document) and save it on the DB
      let url = new Url({
        original_uRL: originalURL,
        short_url: shortenedURL
      });
    
      url.save((err, data) => {
        if (err) {
         console.error(err);
        }
      });
    
      res.json({
        original_url: originalURL,
        short_url: shortenedURL
      });
      
    };
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});