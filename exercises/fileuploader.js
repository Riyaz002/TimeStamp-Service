var express = require('express');
var router = express.Router();

const multer = require('multer');

// Set up storage location and filename
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public');  // where to save the uploaded files
  	},
  	filename: (req, file, cb) => {
  		cb(null, file.originalname);  // file name format
  	}
});

const upload = multer({ storage: storage });

router.use('./public', express.static(process.cwd() + './public'));

router.use("/", upload.single('upfile'), (req, res, next) => {
  	const file = req.file;
  	if(file){
  		res.json({ name: file.filename, type: file.mimetype, size: file.size });
        	console.log('Received file:', file);
  	} else {
		next();
	}
});


module.exports = router;
