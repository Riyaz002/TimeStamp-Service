let express = require('express');
let app = express();

app.get("/", (req, res) => {
	res.send('Hello');
})

app.listen(80, () => {
	console.log('intercepter');
})
