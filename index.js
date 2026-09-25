require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const cors = require("cors");
const songRouter = require("./routes/songRouter");
const userRouter = require("./routes/user/userAuth");
const playlistRoutes = require("./routes/playlistRouter");
const favoriteRoutes = require("./routes/favoriteRoutes");

const verifyToken = require("./middleware/auth");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

mongoose.set("strictQuery", false);
mongoose
    .connect("mongodb://127.0.0.1:27017/music")
    .then(() => console.log("Mongodb Connected!"))
    .catch((error) => console.log(error));
app.use("/api/users", userRouter);
app.use("/api/music", songRouter);
app.use("/api/music/playlists", playlistRoutes);
app.use("/api/music/favorite", favoriteRoutes);

// Khởi chạy HTTP server thông thường thay vì HTTPS
app.listen(port, "0.0.0.0", () => {
    console.log(`Sol App listening on http://localhost:${port}`);
});
