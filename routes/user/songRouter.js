const express = require("express");
const router = express.Router();
const { ZingMp3 } = require("zingmp3-api-full");
const verifyToken = require("../../middleware/auth");
const User = require("../../models/User");
const MyPlaylist = require("../../models/MyPlaylist");

router.get("/", async (req, res) => {
    try {
        const data = await ZingMp3.getHome();
        if(data.msg) {
            return res.json({success: true, message: "Lấy dữ liệu cho trang chủ thành công", homeData: data.data})
        } else {
            return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
        
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

router.get('/top100', async (req, res) => {
    try {
        const data = await ZingMp3.getTop100();
        if(data.msg) {
            return res.json({success: true, message: "Lấy dữ liệu top 100 thành công", data: data.data})
        } else {
            return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

// get new Release
router.get('/newrelease', async (req, res) => {
    try {
        const dataSongPromise = ZingMp3.getNewRelease('song');
        const dataAlumPromise = ZingMp3.getNewRelease('album');
        Promise.all([dataSongPromise, dataAlumPromise]).then((array) =>{
            return res.json({success: true, message: "Lấy dữ liệu bài hát mới phát hành thành công", data: {
                song: array[0].data,
                album: array[1].data
            }})
        }).catch((error) => {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" });
        })    
       
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

router.get('/album/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const response = await ZingMp3.getDetailPlaylist(id);
        if(response.msg) {
            return res.json({success: true, message: "Lấy dữ liệu playlist thành công", data: response.data});
        } else {
            return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

router.get('/search', async(req, res) => {
    const q = req.query.query;
    try {
        const response = await ZingMp3.search(q);
        if(response.msg) {
            return res.json({success: true, message: "Lấy dữ liệu tìm kiếm thành công", result: response.data});
        } else {
            return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

router.get('/song/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const response = await ZingMp3.getSong(id);
        const info = await ZingMp3.getInfoSong(id);

        if(response.msg === 'Success' && info.msg) {
            return res.json({success: true, message: "Lấy dữ liệu bài hát thành công", data: response.data, info: info.data});
        } else {
            return res
            .status(200)
            .json({ success: false, message: "Bài hát chỉ dành cho tài khoản VIP" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

router.get('/song/lyric/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const response = await ZingMp3.getLyric(id);
        if(response.msg) {
            return res.json({success: true, message: "Lấy dữ liệu lời bài hát thành công", lyric: response.data});
        } else {
            return res
            .status(200)
            .json({ success: false, message: "Bài hát chỉ dành cho tài khoản VIP" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

// get genres
router.get('/genres', async(req, res) => {
    try {
        const response = await ZingMp3.getGenres();
        if(response.msg) {
            return res.json({success: true, message: "Lấy dữ liệu thể loại nhạc thành công", genres: response.data});
        } else {
            return res
            .status(200)
            .json({ success: false, message: "Internal server" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

// get detail genre
router.get('/genres/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const response = await ZingMp3.getDetailGenre(id);
        if(response.msg) {
            return res.json({success: true, message: "Lấy dữ liệu chi tiết thể loại nhạc thành công", genresDetail: response.data});
        } else {
            return res
            .status(200)
            .json({ success: false, message: "Internal server" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

// my music
// get all my playlist
router.get('/mymusic/playlist', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        const playlist = await MyPlaylist.find({username: user.username});
        return res.status(200).json({success: true, message: "Đã lấy dữ liệu playlist thành công", playlist: playlist})
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

// get single my playlist
router.get('/mymusic/playlist/:slug', verifyToken, async (req, res) => {
    const {slug} = req.params;
    try {
        const user = await User.findOne({_id: req.userId});
        const playlist = await MyPlaylist.find({username: user.username, slug: slug});
        if(playlist) {
            return res.status(200).json({success: true, message: "Đã lấy dữ liệu playlist thành công", playlist: playlist[0]})
        } else {
            res.status(200).json({ success: false, message: "Không tìm thấy playlist" });
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

// add new playlist
router.post('/mymusic/playlist/new', verifyToken, async (req, res) => {
    const formData = req.body;
    try {
        const newPlaylist = new MyPlaylist(formData);
        await newPlaylist.save();
        return res.status(200).json({success: true, message: "Đã thêm mới playlist thành công", playlist: newPlaylist})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

// delete my playlist
router.delete('/mymusic/playlist/delete/:slug', verifyToken, async (req, res) => {
    const {slug} = req.params;
    try {
        const playlist = await MyPlaylist.findOne({slug});
        if(playlist) {
            await MyPlaylist.deleteOne({slug});
            return res.status(200).json({success: true, message: "Đã xóa playlist thành công", playlist: playlist})
        } else {
            return res.status(200).json({success: false, message: "Không tìm thấy playlist"})
        }       
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

// add song to playlist
router.patch('/mymusic/playlist/:id/addsong', verifyToken, async (req, res) => {
    const song = req.body;
    const {id} = req.params;
    try {
        const playlist = await MyPlaylist.findOne({_id: id});
        const updated = {
           song: playlist.song.concat(song)
        };
        const playlistUpdate = await MyPlaylist.findOneAndUpdate({_id: id}, updated, {new: true});
        return res.status(200).json({success: true, message: "Đã thêm bài hát vào playlist thành công", playlist: playlistUpdate})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// delete song from playlist
router.patch('/mymusic/playlist/:slug/deletesong', verifyToken, async (req, res) => {
    const song = req.body;
    const {slug} = req.params;
    console.log(slug);
    try {
        const playlist = await MyPlaylist.findOne({slug});
        if(playlist) {
            const updated = {
                song: playlist.song.filter((item) => item.encodeId !== song.encodeId)
             };
             const playlistUpdate = await MyPlaylist.findOneAndUpdate({slug}, updated, {new: true});
             return res.status(200).json({success: true, message: "Đã xóa bài hát khỏi playlist thành công", playlist: playlistUpdate})
        } else {
            return res.status(200).json({success: false, message: "Không tìm thấy playlist"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

router.get('/artist/:slug', async(req, res) => {
    const {slug} = req.params;
    try {
        const response = await ZingMp3.getArtist(slug);
        if(response.msg) {
            return res.status(200).json({success: true, data: response.data, message: "Lấy dữ liệu ca sĩ thành công"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

// add song to library
router.patch('/mymusic/library/add', verifyToken, async (req, res) => {
    const item = req.body;
    try {
        const user = await User.findOne({_id: req.userId});
        const updated = {
            music: {
                playlist: user.music.playlist,
                library: [...user.music.library].concat(item)
            }
        };
        const userUpdated = await User.findOneAndUpdate({_id: req.userId}, updated, {new: true});
        return res.status(200).json({success: true, message: "Đã thêm mới bài hát vào thư viện thành công", user: userUpdated})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

// remove song from lybrary
router.patch('/mymusic/library/remove', verifyToken, async (req, res) => {
    const {id} = req.body;
    try {
        const user = await User.findOne({_id: req.userId});
        const updated = {
            music: {
                playlist: user.music.playlist,
                library: user.music.library.filter((item) => item.encodeId !== id)
            }
        };
        const userUpdated = await User.findOneAndUpdate({_id: req.userId}, updated, {new: true});
        return res.status(200).json({success: true, message: "Đã xóa bài hát khỏi thư viện thành công", user: userUpdated})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})




module.exports = router