const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth"); // Middleware check JWT Token

const Favorite = require("../models/Favorite.js");
router.use(verifyToken);
// 1. Lấy danh sách bài hát yêu thích
router.get("/", async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            userId: req.userId,
        });

        return res.status(200).json({
            success: true,
            songs: favorite?.songs || [],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// 2. Thêm bài hát vào danh sách yêu thích
router.post("/addFavorite", async (req, res) => {
    try {
        const song = req.body.song;
        if (!song?.encodeId) {
            return res.status(400).json({
                success: false,
                message: "Thông tin bài hát không hợp lệ!",
            });
        }

        let favorite = await Favorite.findOne({
            userId: req.userId,
        });

        // User chưa có Favorite document
        if (!favorite) {
            favorite = await Favorite.create({
                userId: req.userId,
                songs: [song],
            });

            return res.status(201).json({
                success: true,
                message: "Đã thêm bài hát vào yêu thích!",
                favorite,
            });
        }

        // Kiểm tra bài hát đã tồn tại
        const isSongExist = favorite.songs.some(
            (item) => item.encodeId === song.encodeId,
        );

        if (isSongExist) {
            return res.status(400).json({
                success: false,
                message: "Bài hát này đã có trong danh sách yêu thích!",
            });
        }

        favorite.songs.push(song);
        await favorite.save();

        return res.status(200).json({
            success: true,
            message: "Đã thêm bài hát vào yêu thích!",
            favorite,
        });
    } catch (error) {
        console.error("Lỗi addSongToFavorites:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi thêm bài hát vào yêu thích",
        });
    }
});

// 3. Xóa bài hát khỏi danh sách yêu thích
router.delete("/delete/:encodeId", async (req, res) => {
    try {
        const { encodeId } = req.params;

        const favorite = await Favorite.findOneAndUpdate(
            {
                userId: req.userId,
            },
            {
                $pull: {
                    songs: {
                        encodeId: encodeId,
                    },
                },
            },
            {
                new: true,
            },
        );

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh sách yêu thích!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Đã xóa bài hát khỏi yêu thích!",
            favorite,
        });
    } catch (error) {
        console.error("Lỗi removeSongFromFavorites:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa bài hát khỏi yêu thích",
        });
    }
});

module.exports = router;
