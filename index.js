let express = require('express');
let app = express();


app.get("/api/:date", (req, res) => {
	const toTimestamp = date => Math.floor(date.getTime() / 1000);
	const fromTimestamp = timestamp => new Date(timestamp * 1000);

	let unixTimestamp;
	let date;
	const dateString = req.params.date;
	if(dateString.includes('-')){
		date = new Date(dateString);
		unixTimestamp = toTimestamp(date);

	} else{
		date = fromTimestamp(dateString);
		unixTimestamp = toTimestamp(date);
	}
	res.json({ unix: unixTimestamp, utc: date.toUTCString() })
})

app.listen(80, () => {
	console.log('intercepter');
})
