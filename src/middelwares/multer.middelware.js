//multer used{injected} when ever, we need any kind of file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/Temp"); // this is assigning the the path where the file is getting  stored in server
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // not utilising any fancy name for file saved at server for now
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
