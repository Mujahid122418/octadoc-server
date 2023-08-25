const Category = require("../models/category");

exports.addCategory = async (req, res) => {
  const payload = req.body;

  await Category(payload)
    .save()
    .then((item) => {
      res.json({ success: true, data: item });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// Route to get paginated data
exports.getCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Get the page size or default to 10

  try {
    const totalDocuments = await Category.countDocuments(); // Get the total number of documents

    const totalPages = Math.ceil(totalDocuments / pageSize); // Calculate the total number of pages

    const skip = (page - 1) * pageSize; // Calculate the number of documents to skip

    // Query and retrieve paginated data
    const data = await Category.find().skip(skip).limit(pageSize);

    res.json({
      data,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params?.id)
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
      res.status(500).send({
        success: false,
        message: error.message,
      });
    });
};

exports.updateCategory = async (req, res) => {
  await Category.findByIdAndUpdate(req.params?.id, req.body, {
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
        res.status(400).send({
          success: false,
          message: "Not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    });
};
