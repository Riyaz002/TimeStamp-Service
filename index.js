// index.js
// where your node app starts

// init project
require('dotenv').config();
var playingDates = require('./exercises/TimeStamp.js');
var Whoami = require('./exercises/whoami.js');
var Urlshortner = require('./exercises/urlshortner');
var ExerciseTracker = require('./exercises/exercise-tracker.js');
var FileUploader = require('./exercises/fileuploader.js');
var express = require('express');
var cors = require('cors');
var app = express();
require('./model/db.js');
app.use(cors());  // some legacy browsers choke on 204

// Parse JSON bodies
app.use(express.json());

// To parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	console.log(req.path);
	next();
})

app.use(FileUploader);

app.use(ExerciseTracker);

app.use(Urlshortner);

app.use(Whoami);

app.use(playingDates);

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

