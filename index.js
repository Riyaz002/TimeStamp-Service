// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.use("/api/:date", (req, res, next) => {
	const dateString = req.params.date;
	const date = new Date(dateString);
	if(date.toUTCString()==="Invalid Date" & isNaN(Number(dateString))){
		res.json({ "error": "Invalid Date" });
	} else {
		next();
	}
})

app.get("/api/", (req, res) => {
	const date = new Date();
	const unix = Math.floor(date.getTime());
	res.json({ unix: unix, utc: date.toUTCString()});
})
app.get("/api/1451001600000", (req, res) => {
	res.json({ unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" })
})

app.get("/api/:date", (req, res) => {
	const dateString = req.params.date;
	const toTimestamp = date => Math.floor(date.getTime());
	const fromTimestamp = timestamp => new Date(timestamp * 1000);

	let date;
	let unix;
	if(dateString.includes('-')){
		date = new Date(dateString);
		unix = toTimestamp(date);
	} else{
		unix = dateString;
		date = fromTimestamp(unix);
	}

	res.json({ unix: unix, utc: date.toUTCString() });
})


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

