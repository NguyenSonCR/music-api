const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        coverImage: {
            type: String,
            default: "",
        },
        // 💥 Lưu trực tiếp danh sách các Object bài hát
        songs: [
            {
                encodeId: { type: String, required: true },
                title: { type: String, required: true },
                artistsNames: { type: String, default: "" },
                duration: { type: Number, default: 0 },
                thumbnailM: { type: String, default: "" },
                thumbnail: { type: String, default: "" },
                link: { type: String, default: "" },
                category: { type: String, default: "" },
                url: { type: String, default: "" },
            },
        ],
        slug: {
            type: String,
            lowercase: true,
            trim: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Playlist", playlistSchema);
