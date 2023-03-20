const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const UserSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },

  music: {
    playlist: [
      {
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
      }
    ],
    library: [],
},

  img: {
    type: String,
  },

  phoneNumber: {
    type: String,
  },

  fullName: {
    type: String,
  },

  address: {
    type: String,
  },

  email: {
    type: String,
    default: "",
  },

  createAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("User", UserSchema);
