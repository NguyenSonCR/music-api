require("dotenv").config();
const express = require("express");
const router = express.Router();
const multerImage = require("multer");
const fs = require("fs");
const url = process.env.IMAGE_URL;

// upload image to server
const diskStorage = multerImage.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multerImage({ storage: diskStorage });

router.post("/image/single", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  const fileType = file.mimetype.split("/")[1];
  const newFileName = file.filename + "." + fileType;
  fs.rename(
    `./static/image/${file.filename}`,
    `./static/image/${newFileName}`,
    () => {}
  );
  const result = `${url}${newFileName}`;
  return res.json({ success: true, result });
});

router.post("/image/multiple", upload.array("files"), async (req, res) => {
  const files = req.files;
  try {
    if (files) {
      let couter = 1;
      let result = [];
      await files.map((file, index) => {
        const fileType = file.mimetype.split("/")[1];
        const newFileName = file.filename + "." + fileType;
        fs.rename(
          `./static/image/${req.files[index].filename}`,
          `./static/image/${newFileName}`,
          () => {}
        );

        if (couter === files.length) {
          result = result.concat(`${url}${newFileName}`);
          return res.status(200).json({ success: true, result });
        } else {
          result = result.concat(`${url}${newFileName}`);
          couter = couter + 1;
        }
      });
    } else {
      return res.status(400).send({ message: "Please upload a file!" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/audio", upload.single("audio"), (req, res) => {
  const audio = req.audio;
  if (!audio) {
    const error = new Error("Please upload a audio");
    error.httpStatusCode = 400;
    return next(error);
  }
  const fileType = file.mimetype.split("/")[1];
  const newFileName = file.filename + "." + fileType;
  fs.rename(
    `./static/music/${file.filename}`,
    `./static/music/${newFileName}`,
    () => {}
  );
  const result = `${url}${newFileName}`;
  return res.json({ success: true, result });
})

module.exports = router;
