var mongoose = require('mongoose');

var urlSchema = mongoose.Schema({
	url: {type: String, required: true, unique:true}
})

var Url = mongoose.model("Url", urlSchema);

module.exports = Url;
