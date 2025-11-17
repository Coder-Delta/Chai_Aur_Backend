import multer from "multer";

//The main use of Multer is to handle file uploads from an HTML form that includes a file input field

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname); // this code save the file in unique name assingnment
  },
});

export const upload = multer({
  storage,
});
