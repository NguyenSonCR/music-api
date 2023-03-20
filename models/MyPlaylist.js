const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const MyPlaylistSchema = new Schema({
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  img: {
    type: String
  },
  song: {
    type: Array
  },
  slug: { type: String, slug: "name", unique: true },
  createAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("MyPlaylist", MyPlaylistSchema);
