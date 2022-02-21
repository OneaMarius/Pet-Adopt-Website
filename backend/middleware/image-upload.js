///// cloudinary image upload /////
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
   cloud_name: process.env.cloud_name,
   api_key: process.env.api_key,
   api_secret: process.env.api_secret
});

const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params: {
      folder: process.env.cloudinary_folder,
   },
});

const upload = multer({ storage: storage });

const configuredMulterMiddleware = upload.single("image"); // the name of the file input in new-product.ejs

module.exports = configuredMulterMiddleware;
