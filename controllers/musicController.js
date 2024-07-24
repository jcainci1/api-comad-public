const PrivateLessonsRequest = require("../models/privateLessonsRequestModel");
const catchAsync = require("../utils/catchAsync");

exports.createMusicPrivateLessonRequest = catchAsync(async (req, res, next) => {
  const formBody = req.body;
  console.log(formBody);
  await PrivateLessonsRequest.create(formBody)
    .then((result) => {
      res.status(201).json({
        status: "success",
        data: {
          request: result,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    });
});
