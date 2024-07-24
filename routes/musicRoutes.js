const express = require("express");
const musicController = require("../controllers/musicController");

const router = express.Router();

router
  .route("/create-lesson-request")
  .post(musicController.createMusicPrivateLessonRequest);

module.exports = router;
