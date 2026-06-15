// routes/Certificates.js
const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/certificates/",
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("certificate"), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get("host")}/certificates/${req.file.filename}`;
  res.json({ url: fileUrl });
});

module.exports = router;
