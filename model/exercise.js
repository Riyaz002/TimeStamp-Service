var mongoose = require('mongoose');

var exerciseSchema = mongoose.Schema({
	description: String,
	duration: Number,
	date: String
})

var Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = {
	exerciseSchema,
	Exercise
}
