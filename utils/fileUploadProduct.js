const multer = require("multer");

const FILE_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidType = FILE_TYPES[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValidType) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads/products");
  },
  filename: function (req, file, cb) {
    // const filenName = file.originalname.split(" ").join("-");

    // const uniqueFileImage =
    //   filenName +
    //   "-" +
    //   Date.now() +
    //   "-" +
    //   Math.round(Math.random() * 1e9 + "." + extention);
    const originalname = file.originalname.split(" ").join("-");

    const extention = FILE_TYPES[file.mimetype];
    const uniqueFileImage = `${originalname}-${Date.now()}.${extention}`;
    cb(null, uniqueFileImage);
  },
});

const uploadOption = multer({
  storage: storageFile,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = { uploadOption };
