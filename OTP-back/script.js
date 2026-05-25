

require("dotenv").config();

const express = require("express");
const app = express();

const route = require("./routes/routes");
const cors = require("cors");
const mongo = require("mongoose");

app.use(express.json());
app.use(cors());

mongo.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) =>
    console.error("MongoDB connection error:", err)
  );

app.use("/", route);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});