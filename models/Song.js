const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
mongoose.plugin(slug);

const SongSchema = new Schema(
  {
    name: { type: String, default: "", require: true },
    author: { type: String, default: "", require: true },
    src: { type: String, default: "", require: true },
    lyrics: { type: String, default: "", require: true },
    description: { type: String, default: "" },
    img: { type: String, require: "" },  
    slug: { type: String, slug: "name", unique: true },
    buff: Buffer,
  },
  {
    timestamps: true,
  }
);
ProductSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("song", SongSchema);
