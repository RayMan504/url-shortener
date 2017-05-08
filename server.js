const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Url = require('./models/url.js');

// package for url validation
const validUrl = require('valid-url');

// mongodb uri
const mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/app-dev';
const mongoOptions = {db: {safe: true}};
const baseUrl = process.env.BASE_URL || ('http://localhost:8080/');
mongoose.Promise = global.Promise;

// connect to database
mongoose.connect(mongoUri, mongoOptions);
// run error if connection fails
mongoose.connection.on('error', function(err) {
    console.error(`MongoDB connection failed due to ${err}`);
    process.exit(-1);
})

app.get('/', function(req, res) {
    res.send("Hello World");
})

// route for shortening uri
app.get('/new/*', function(req, res) {
   const original = req.url.replace('/new/', '');
   
   // if url is not valid
   if(!validUrl.isWebUri(original)) {
    // return error as response
     res.json({ error: "Invalid URL"});
   }
   // create url with mongoose
   Url.create({
     initUrl: original  
   }, function(err, created) {
       if(err) { console.error(err); }
       res.json({
           initUrl: created.initUrl,
           shortenedUrl: baseUrl + created.shortenedUrl
       });
   });
});

// route for redirecting url
app.get('/*', function(req, res) {
    // search database for input shortened url
    Url.findOne({shortenedUrl: req.url.slice(1)}).exec().then(function(found) {
        // if found
        if (found) {
            // redirect user
            res.redirect(found.initUrl);
        } else {
            // throw error
            res.send({error: "No short url found for given input"});
        }
    });
});

app.listen(8080, function() {
    console.log("Listening on port 8080");
});