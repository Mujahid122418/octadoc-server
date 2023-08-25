const express = require("express");
const app = express();
var cors = require("cors");
const dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
const port = process.env.PORT || 5051;

// const colors = require('colors');
require("./config/db");
// Load env vars
dotenv.config({ path: "./config/config.env" });
// const bootCamp = require("./routes/bootcamp");
// const course = require("./routes/courses");
const auth = require("./routes/auth");
const question = require("./routes/templateQuestion");
const section = require("./routes/section");
const template = require("./routes/template");
const answer = require("./routes/answer");
const category = require("./routes/category");

const errorHandler = require("./utils/errorMiddleware");
app.use(cors());
app.use(errorHandler);
app.use(express.json());
app.use(cookieParser());

// app.use("/api", bootCamp);
// app.use("/course", course);
app.use("/auth", auth);
app.use("/question", question);
app.use("/section", section);
app.use("/template", template);
app.use("/answer", answer);
app.use("/category", category);

app.get("/m", function (req, res) {
  console.log("process.env.NODE_ENV", process.env.NODE_ENV, port);
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} on localhost:${port}`.green
  );
});
process.on("unhandel", (err, promise) => {
  console.log("err", err);
  app.close(() => process.exit(1));
});
