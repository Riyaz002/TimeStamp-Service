var mongoose = require('mongoose');

var exerciseSchema = mongoose.Schema({
	description: {type: String, required: true},
	duration: {type: Number, required: true},
	date: { type: Date, default: Date.now }
})

var userSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	count: {type: String, default: 0},
	logs: [exerciseSchema]
})

var User = mongoose.model("User", userSchema);

module.exports = User;
