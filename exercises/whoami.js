var express = require('express');
var router = express.Router();

router.get("/api/whoami", (req, res) =>{ 
	const reqIp = req.ip;
	const reqLanguage = req.headers['accept-language'];
	const reqSoftware = req.headers['user-agent'];
	res.json({ipaddress: reqIp, language: reqLanguage, software: reqSoftware})
});


module.exports = router;
