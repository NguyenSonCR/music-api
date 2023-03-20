require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT;
const path = require("path");
const cors = require('cors');
const songRouter = require('./routes/user/songRouter');
const userRouter = require("./routes/user/userAuth");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://sonnguyen:IbptziNji$6440@noloce.awhxmhm.mongodb.net/noloce')
  .then(() => console.log('Mongodb Connected!'));

app.use("/api/users", userRouter);
app.use("/api/music", songRouter);

app.listen(port, () => {
  console.log(`Noloce listening on port ${port}`)
});