const mongoose = require("mongoose");
const schema = mongoose.Schema;

const category_Schema = new schema(
  {
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", category_Schema);
