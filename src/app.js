const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
require("colors"); // for colorful clg(s)

const { router: userRouter } = require("./routes/userRoutes");

const app = express();

dotenv.config(); // loads all environment Variables

// middlewares
app.use(express.json()); // parse the incoming raw json and attach the parsed data (JS obj) to req.body.
// Global middlware. hence, works for each controller defined in this file or other files.

// routes
app.use("/api/v1/auth", userRouter);

// Home route to indicate server is working perfectly fine.
app.get("/", (_, res) =>
  res.send("<h1>devTinder Server is up & running.</h1>")
);

const PORT = process.env.PORT || 7777;

// Always connect your nodeApp with DB at first then make your nodeApp to listen at PORT NO.
connectDB()
  .then((connData) => {
    // using optional chaining
    console.log(
      `Connected to mongoDB database ${connData?.connection?.host}`.bgMagenta
        .white
    );

    app.listen(PORT, () =>
      console.log(`Server started listening at PORT No. ${PORT}`.bgWhite.black)
    );
  })
  .catch((e) => console.log(`Failed to connect to DB. ${e}`.bgRed.yellow));
