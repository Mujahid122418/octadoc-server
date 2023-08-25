const Answer = require("../models/answer");
const { populate } = require("../models/template");

exports.addAnswer = async (req, res) => {
  const payload = req.body;

  await Answer(payload)
    .save()
    .then((item) => {
      res.json({ success: true, data: item });
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
};

// Route to get paginated data
exports.getAnswer = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Get the page size or default to 10

  try {
    const totalDocuments = await Answer.countDocuments(); // Get the total number of documents

    const totalPages = Math.ceil(totalDocuments / pageSize); // Calculate the total number of pages

    const skip = (page - 1) * pageSize; // Calculate the number of documents to skip

    // Query and retrieve paginated data
    const data = await Answer.find()

      .skip(skip)
      .limit(pageSize)
      .exec();

    res.json({
      data,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.deleteAnswer = async (req, res) => {
  console.log("params ans", req.params?.id);
  Answer.findOneAndDelete({ _id: req.params?.id })
    .then((deletedPost) => {
      if (deletedPost) {
        res.status(200).send({
          success: true,
          message: "Delete successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Not found",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    });
};

exports.updateAnswer = async (req, res) => {
  Answer.findByIdAndUpdate(req.params?.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedPost) => {
      if (updatedPost) {
        res.status(200).send({
          success: true,
          message: "Updated successfully",
          data: updatedPost,
        });
      } else {
        console.log("Answer not found");
        res.status(400).send({
          success: false,
          message: "Not found",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    });
};
