const express = require('express');
const app = express();
const mongoose = require('mongoose');

// package for url validation
const validUrl = require('valid-url');

// mongodb uri
const mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/app-dev';
const mongoOptions = {db: {safe: true}};
const baseUrl = process.env.BASE_URL || ('http://localhost:8080/');

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

app.listen(8080, function() {
    console.log("Listening on port 8080");
});