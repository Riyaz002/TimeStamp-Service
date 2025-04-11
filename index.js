let express = require('express');
let app = express();


app.get("/api/:date", (req, res) => {
	const dateString = req.params.date;
	const date = Date(dateString).toString();
	res.json({ unix: dateString, utc: date })

})

app.listen(80, () => {
	console.log('intercepter');
})
