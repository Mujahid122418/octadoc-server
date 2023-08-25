const mongoose = require("mongoose");
const schema = mongoose.Schema;

const section_Schema = new schema(
  {
    tempplate_id: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      index: true,
    },

    order: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("section", section_Schema);
