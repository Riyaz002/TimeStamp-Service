// index.js
// where your node app starts

// init project
require('dotenv').config();
var dns = require('dns');
var express = require('express');
var app = express();
require('./model/db.js');
var Url = require('./model/url.js');
var User = require('./model/user.js');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// Parse JSON bodies
app.use(express.json());

// To parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

app.post('/api/users', (req, res) => {
	var username = req.body.username;
	try{
		User.findOneAndUpdate({
			username: username
		},{
			username: username
		},{
			upsert: true, new: true
		}).then((savedUser) => {
			res.json({ username: savedUser.username, _id: savedUser._id });
		})
	} catch(err){
		res.json({err: "User is already registered."})
	}
})

app.get("/api/users", (req, res) => {
	User.find({}, 'username _id').then(users => {
  		res.json(users);
	});
//	User.find({})
//		.then((allUsers) => {
//			res.json(allUsers);
//		})
})

app.post("/api/users/:_id/exercises", (req, res) => {
	var { description, duration, date } = req.body;
	if(!date) {
		date = new Date();
	}
	const id = req.params._id;
	User.findById({ _id: id })
		.then((savedUser) => {
			savedUser.logs.push({ description, duration, date});
			savedUser.count = savedUser.logs.length;
			savedUser.save()
				.then((updatedUser) => {
					res.json(updatedUser);
				})
		})
})

app.get("/api/users/:_id/exercises", (req, res) => {
	const id = req.params._id;
	User.findById({ _id: id })
		.then( (user) => {
			res.json({ logs: user.logs });
		})
})

app.get("/api/users/:_id/logs", (req, res) => {
	let newLogs = [];
	User.findById(req.params._id)
		.then((user) => {
			user.logs = user.logs.map( current => {
				current.date = new Date(current.date).toDateString();
				newLogs.push({ description: current.description, duration: current.duration, date: current.date });
			});
			res.json({count: user.count, logs: newLogs });
	})
})

app.post("/api/shorturl", (req, res, next) => {
	const originalUrl = req.body.url;
	try{
		let url = new URL(originalUrl);
		let hostname = url.hostname;
		dns.lookup(hostname, (err, address, family) => {
			if(err){
				res.json({ error: 'invalid url' })
			} else{
				next();
			}
		})
	} catch(err){
		console.log(err);
		res.json({ error: 'invalid url' });
	}
})

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

const urls = new Map();
let count = 0;

function getHashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0; // force 32-bit int
  }
  return hash;
}

app.post("/api/shorturl", (req, res) => {
	const url = req.body.url;
//	const shortUrl = getHashCode(url);
//	urls.set(shortUrl, url);
	Url({url: url})
		.save()
		.then((savedUrl) => {
			res.json({original_url: url, short_url: savedUrl._id})
		});
})

app.use("/api/shorturl/:shorturl", (req, res) => {
	const shortUrl = req.params.shorturl;
	Url.findById({_id: shortUrl})
		.then((savedUrl) =>{
			res.redirect(savedUrl.url);
		});
	//const originalUrl = urls.get(Number(shortUrl));
	//res.redirect(originalUrl);
})

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/whoami", (req, res) =>{ 
	const reqIp = req.ip;
	const reqLanguage = req.headers['accept-language'];
	const reqSoftware = req.headers['user-agent'];
	res.json({ipaddress: reqIp, language: reqLanguage, software: reqSoftware})
})

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
 	let date = req.params.date;

  	if (!isNaN(Number(date))) {
   	 	let unix = new Date(Number(date)).getTime();
    		let utc = new Date(Number(date)).toUTCString();
    		return res.json({ unix: unix, utc: utc });
  	}

  	let unix = new Date(date).getTime();
  	if(isNaN(unix)) return res.json({ error: "Invalid Date" })

 	let utc = new Date(Date.parse(date)).toUTCString();

  	return res.json({ unix: unix, utc: utc });
})


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

