const Answer = require("../models/answer");
const TemplateQuestions = require("../models/templateQuestions");

exports.addQuestion = async (req, res) => {
  const payload = req.body;

  await TemplateQuestions(payload)
    .save()
    .then((item) => {
      res.json({ success: true, data: item });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// Route to get paginated data
exports.getQuestion = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Get the page size or default to 10

  try {
    const totalDocuments = await TemplateQuestions.countDocuments(); // Get the total number of documents

    const totalPages = Math.ceil(totalDocuments / pageSize); // Calculate the total number of pages

    const skip = (page - 1) * pageSize; // Calculate the number of documents to skip

    // Query and retrieve paginated data
    const data1 = await TemplateQuestions.find()
      .lean()
      // .populate("template_id")
      .skip(skip)
      .limit(pageSize);

    let ans = await Answer.find({ question_id: { $in: data1 } }).lean();
    // let d = {
    //   ques: data1,
    //   ans: ans,
    // };
    // console.log("d is d", d);
    const data = await data1.map((objA) => {
      const matchingObjB = ans.find(
        (objB) => objB?.question_id.toString() === objA._id.toString()
      );

      if (
        matchingObjB &&
        Object.keys(matchingObjB).length > 0 &&
        matchingObjB !== null &&
        matchingObjB !== undefined
      ) {
        let {
          follow_up_question_group_id,
          text,
          question_id,
          template_id,
          _id,
        } = matchingObjB;

        let send = {
          follow_up_question_group_id,
          text,
          question_id,
          template_id,
          ans_id: _id,
        };

        return { ...objA, ...send };
      } else {
        return { ...objA };
      }
    });

    res.json({
      data,
      currentPage: page,
      totalPages,
      count: totalDocuments,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.deleteQuestion = async (req, res) => {
  await Answer.deleteMany({ question_id: req.params?.id });
  await TemplateQuestions.findByIdAndDelete(req.params?.id)
    .then((deletedPost) => {
      if (deletedPost) {
        res.status(200).send({
          success: true,
          message: "Delete successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Not found ",
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

exports.updateQuestion = async (req, res) => {
  TemplateQuestions.findByIdAndUpdate(req.params?.id, req.body, {
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

exports.singleQuestion = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Get the page size or default to 10

  try {
    const totalDocuments = await TemplateQuestions.countDocuments(); // Get the total number of documents

    const totalPages = Math.ceil(totalDocuments / pageSize); // Calculate the total number of pages

    const skip = (page - 1) * pageSize; // Calculate the number of documents to skip

    // Query and retrieve paginated data

    // Find data based on the query
    // { _id: req?.params.id }

    const data1 = await TemplateQuestions.findOne({ _id: req.params.id })
      .lean()
      .skip(skip)
      .limit(pageSize);

    // let ans = await Answer.findOne({ _id: req.params.id }).lean();

    // const data = await data1.map((objA) => {
    //   const matchingObjB = ans.find(
    //     (objB) => objB?.question_id.toString() === objA._id.toString()
    //   );
    //   if (
    //     matchingObjB &&
    //     Object.keys(matchingObjB).length > 0 &&
    //     matchingObjB !== null &&
    //     matchingObjB !== undefined
    //   ) {
    //     let {
    //       follow_up_question_group_id,
    //       text,
    //       question_id,
    //       template_id,
    //       _id,
    //     } = matchingObjB;

    //     let send = {
    //       follow_up_question_group_id,
    //       text,
    //       question_id,
    //       template_id,
    //       ans_id: _id,
    //     };

    //     return { ...objA, ...send };
    //   } else {
    //     return { ...objA };
    //   }
    // });
    res.json({
      data1,
      currentPage: page,
      totalPages,
    });
  } catch (error) {}
};
