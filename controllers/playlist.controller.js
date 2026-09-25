import Playlist from "../models/Playlist.js";

// Hàm hỗ trợ tạo slug chuẩn tiếng Việt
const createSlug = (str) => {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/^-+|-+$/g, "");
};

// 1. Lấy danh sách playlist của user đang đăng nhập
export const getMyPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.userId }).sort({
            createdAt: -1,
        });
        return res.status(200).json({ success: true, playlists });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Tạo playlist mới (tự tạo slug)
export const createPlaylist = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res
                .status(400)
                .json({ success: false, message: "Tên playlist là bắt buộc!" });
        }

        const generatedSlug = `${createSlug(title)}-${Date.now().toString().slice(-4)}`;

        const newPlaylist = await Playlist.create({
            userId: req.userId,
            title,
            description,
            slug: generatedSlug,
            songs: [],
        });

        return res.status(201).json({ success: true, playlist: newPlaylist });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Xóa playlist
export const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const playlist = await Playlist.findOneAndDelete({
            _id: id,
            userId: req.userId,
        });

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy playlist hoặc bạn không có quyền xóa!",
            });
        }

        return res
            .status(200)
            .json({ success: true, message: "Đã xóa playlist thành công!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Thêm bài hát vào Playlist
export const addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const song = req.body.song;

        const playlist = await Playlist.findOne({
            _id: playlistId,
            userId: req.userId,
        });

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy playlist hoặc bạn không có quyền!",
            });
        }

        const isSongExist = playlist.songs.some(
            (item) => item.encodeId === song.encodeId,
        );

        if (isSongExist) {
            return res.status(400).json({
                success: false,
                message: "Bài hát này đã có trong playlist rồi!",
            });
        }

        playlist.songs.push(song);
        await playlist.save();

        return res.status(200).json({
            success: true,
            message: "Đã thêm bài hát vào playlist!",
            playlist,
        });
    } catch (error) {
        console.error("Lỗi addSongToPlaylist:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi thêm bài hát vào playlist",
        });
    }
};

// Xóa bài hát khỏi Playlist
export const removeSongFromPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.params; // songId ở đây chính là encodeId của bài hát

        // Tìm playlist của đúng user và dùng $pull để xóa bài hát có encodeId tương ứng
        const playlist = await Playlist.findOneAndUpdate(
            { _id: playlistId, userId: req.userId },
            { $pull: { songs: { encodeId: songId } } },
            { new: true }, // Trả về playlist mới sau khi cập nhật
        );

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy playlist hoặc bạn không có quyền!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Đã xóa bài hát khỏi playlist!",
            playlist,
        });
    } catch (error) {
        console.error("Lỗi removeSongFromPlaylist:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa bài hát khỏi playlist",
        });
    }
};
