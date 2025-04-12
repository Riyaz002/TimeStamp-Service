require('dotenv').config();
var mongoose = require('mongoose');

class Database{
	constructor(){
		this._connect();
	}

	_connect(){
		mongoose.connect(process.env.MONGO_URL, {
 			useNewUrlParser: true,
  			useUnifiedTopology: true,
		});
		mongoose.connection.on('connected', () => {
			console.log('MongoDB connected!');
		})
	}
}

module.exports = new Database();
