var express = require('express');
var router = express.Router();
var dns = require('dns');
var Url = require('./../model/url.js');

router.post("/api/shorturl", (req, res, next) => {
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
router.use(express.static('public'));

const urls = new Map();
let count = 0;

function getHashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0; // force 32-bit int
  }
  return hash;
}

router.post("/api/shorturl", (req, res) => {
	const url = req.body.url;
	Url({url: url})
		.save()
		.then((savedUrl) => {
			res.json({original_url: url, short_url: savedUrl._id})
		});
})

router.use("/api/shorturl/:shorturl", (req, res) => {
	const shortUrl = req.params.shorturl;
	Url.findById({_id: shortUrl})
		.then((savedUrl) =>{
			res.redirect(savedUrl.url);
		});
})

module.exports = router;
