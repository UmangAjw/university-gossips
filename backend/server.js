const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = 80;
const db = require("./db");
const router = require("./routes");

// Middle Ware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Cors
app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Headers", "*");
  next();
});

// Routes
app.use("/api", router);

app.use("/uploads", express.static(path.join(__dirname, "/../uploads")));
app.use(express.static(path.join(__dirname, "/../frontend/build")));

app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
  } catch (e) {
    res.send("Unexpected error");
  }
});

app.use(cors());

// Server listening
app.listen(process.env.PORT || PORT, () => {
  console.log(`Listening on port no ${PORT}`);
});

// database connection
db.connect();
