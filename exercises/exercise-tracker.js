var express = require('express');
var router = express.Router();
var User = require('./../model/user.js');

router.post('/api/users', (req, res) => {
	var username = req.body.username;
	try{
		User.findOneAndUpdate({
			username: username
		},{
			username: username
		},{
			upsert: true, new: true
		}).then((savedUser) => {
			res.json({ username: savedUser.username, _id: savedUser._id });
		})
	} catch(err){
		res.json({err: "User is already registered."})
	}
})

router.get("/api/users", (req, res) => {
	User.find({}, 'username _id').then(users => {
  		res.json(users);
	});
})

function localToUTCDate (localDate) {
        const year = new Date(localDate).getUTCFullYear()
        const month = new Date(localDate).getUTCMonth()
        const day = new Date(localDate).getUTCDate()
        const UTCDate = new Date(Date.UTC(year, month, day))

        return new Date(UTCDate.getTime() + UTCDate.getTimezoneOffset() * 60000).toDateString()
}

router.post("/api/users/:id/exercises", (req, res) => {
	var { description, duration, date } = req.body;
	let newDate = undefined;
	if(!date) {
		newDate = new Date();
	} else{
		newDate = new Date(date);
	}
	console.log(newDate);
	const id = req.params.id;
	console.log("id is " + id);
	User.findById({ _id: id })
		.then((savedUser) => {
			let newExercise = { description: description, duration: duration, date: newDate}
			savedUser.log.push(newExercise);
			savedUser.count = savedUser.log.length;
			savedUser.save()
				.then((updatedUser) => {
					updatedUser.log.forEach(exercise => {
						newExercise._id = savedUser._id;
						//newExercise.date = localToUTCDate(new Date(exercise.date));
						newExercise.date = new Date(newExercise.date).toDateString();
					});
					res.json({updatedUser, date: newExercise.date, duration: newExercise.duration, description: newExercise.description});
				})
		})
})

router.get("/api/users/:_id/exercises", (req, res) => {
	const id = req.params._id;
	User.findById({ _id: id })
		.then( (user) => {
			res.json({ log: user.log });
		})
})

router.get("/api/users/:_id/logs", (req, res) => {
	let newlog = [];
	const { from, to } = req.query;
	let limit = req.query.limit;
	if(!limit){
		limit = Number.MAX_SAFE_INTEGER;
	}
	User.findById(req.params._id)
		.then((user) => {
			user.log = user.log.map( current => {
				let date = new Date(current.date)
				current.date = date.toDateString();
				if(from && to && limit){
					if(new Date(date) >= new Date(from) && new Date(date) <= new Date(to) && limit != newlog.length){
						console.log(date + 'is between ' + from + ' and ' + to);
						newlog.push({ description: current.description, duration: current.duration, date: current.date });
					}
				} else{
					newlog.push({ description: current.description, duration: current.duration, date: current.date})
				}
			});
			res.json({_id: user._id, username: user.username, count: user.count, log: newlog });
	})
})

module.exports = router;
