const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist.controller");
const verifyToken = require("../middleware/auth"); // Middleware check JWT Token

// Tất cả các route playlist này đều cần đăng nhập (verifyToken)
router.use(verifyToken);
router.get("/", playlistController.getMyPlaylists);
router.post("/create", playlistController.createPlaylist);
router.delete("/delete/:id", playlistController.deletePlaylist);
router.post("/:playlistId/addsong", playlistController.addSongToPlaylist);
router.delete(
    "/:playlistId/deletesong/:songId",
    playlistController.removeSongFromPlaylist,
);

module.exports = router;
