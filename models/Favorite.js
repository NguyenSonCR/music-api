const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        songs: [
            {
                encodeId: {
                    type: String,
                    required: true,
                },

                title: {
                    type: String,
                    required: true,
                },

                artistsNames: {
                    type: String,
                    default: "",
                },

                duration: {
                    type: Number,
                    default: 0,
                },

                thumbnailM: {
                    type: String,
                    default: "",
                },

                thumbnail: {
                    type: String,
                    default: "",
                },

                link: {
                    type: String,
                    default: "",
                },

                category: {
                    type: String,
                    default: "",
                },

                url: {
                    type: String,
                    default: "",
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Favorite", favoriteSchema);
