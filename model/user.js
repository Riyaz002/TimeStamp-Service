var mongoose = require('mongoose');
var { exerciseSchema } = require('./exercise.js');
//var exerciseSchema = mongoose.Schema({
//	description: {type: String, required: true},
//	duration: {type: Number, required: true},
//	date: String
//})

var userSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	count: {type: String, default: 0},
	log: [exerciseSchema]
})

var User = mongoose.model("User", userSchema);

module.exports = User;
