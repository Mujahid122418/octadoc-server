const mongoose = require("mongoose");
const db = "mongodb+srv://Mujahid:Mujahid_1@cluster0-tbovr.mongodb.net/Octadoc";
// mongoose
//   .connect(db)
//   .then(() => console.log("MongoDB connected now..."))
//   .catch((err) => console.log("connection db err", err));

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the MongoDB database");
    // Now, you can define and use your Mongoose models here
  })
  .catch((err) => {
    console.error("Error connecting to the MongoDB database:", err.message);
  });
