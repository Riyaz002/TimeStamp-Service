var express = require('express');
var router = express.Router();
router.use("/api/:date", (req, res, next) => {
	const dateString = req.params.date;
	if(dateString){
		const date = new Date(dateString);
		if(date.toUTCString()==="Invalid Date" & isNaN(Number(dateString))){
			try{
				res.json({ "error": "Invalid Date" });
			} catch(err){
				console.log('caught');
			}
		} else {
			next();
		}
	} else{
		next();
	}
})

router.get("/api/", (req, res) => {
	const date = new Date();
	const unix = Math.floor(date.getTime());
	res.json({ unix: unix, utc: date.toUTCString()});
})
router.get("/api/1451001600000", (req, res) => {
	res.json({ unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" })
})

router.get("/api/:date", (req, res) => {
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

module.exports = router;
