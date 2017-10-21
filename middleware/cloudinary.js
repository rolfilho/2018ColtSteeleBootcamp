//************* Image Upload Configuration *************\\
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Please upload an image file: jpg, jpeg, png or gif'), false);
    }
    cb(null, true);
};
const upload = multer({ storage : storage, fileFilter: imageFilter});

const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dmjqgyy1k',
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
//************* END Image Upload Config *************\\

// export upload and cloudinary
module.exports = {
	cloudinary: cloudinary,
	upload: upload
};