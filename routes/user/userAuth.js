require("dotenv").config();
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../middleware/auth");
const User = require("../../models/User");

//@route GET api/users/
//@descreption Checked if user is logged in
//@access Public
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/users/register
// @desc Register user
// @access public
router.post("/register", async (req, res) => {
  const { username, password, fullName } = req.body;

  // simple validation
  if (!username || !password)
    return res
      .status(200)
      .json({ success: false, message: "Missing username or password" });

  try {
    // check for existing user
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(200)
        .json({ success: false, message: "Tên người dùng đã tồn tại" });

    //   All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username: username,
      password: hashedPassword,
      fullName: fullName
    });
    await newUser.save();

    // return accessToken
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "Tạo tài khoản thành công",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// @route POST api/users/login
// @desc Login user
// @access public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // simple validation
  if (!username || !password)
    return res
      .status(200)
      .json({ success: false, message: "Missing username or password" });

  try {
    // check for existing user
    const user = await User.findOne({ username });
    if (!user)
      return res.status(200).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác",
      });

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res.status(200).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác",
      });

    // all good
    // return accessToken
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "Log in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// @route POST api/users/login/google
// @desc Login user with social
// @access public
router.post("/login/social", async (req, res) => {
  const { img, phonenumber, email, fullName, uid } = req.body;

  try {
    // check for existing user
    const user = await User.findOne({ uid });
    if (!user) {
      const newUser = new User({
        username: uid,
        img,
        phonenumber: phonenumber,
        address: null,
        email: email,
        fullName: fullName,
        uid: uid,
      });
      await newUser.save();
      const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.cookie("social", accessToken, { sameSite: "none", secure: true });
      return res.json({
        success: true,
        message: "Đăng nhập thành công",
        accessToken,
      });
    } else {
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      return res.json({
        success: true,
        message: "Đăng nhập thành công",
        accessToken,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});


// @route PUT api/users/updated
// @desc change info user
// @access private

router.put("/updated", verifyToken, async (req, res) => {
  const user = req.body;
  try {
    const updated = {
      img: user.img,
    };
    let updatedUser = await User.findOneAndUpdate(
      { username: user.username },
      updated,
      {
        new: true,
      }
    );
    return res.json({
      success: true,
      message: "Đã thêm ảnh người dùng thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/users/changepassword
// @desc change info user
// @access private

router.put("/changepassword", verifyToken, async (req, res) => {
  const formValue = req.body;
  const { oldPassword, newPassword, username } = formValue;
  try {
    const user = await User.findOne({ username });
    const passwordValid = await argon2.verify(user.password, oldPassword);
    if (!passwordValid)
      return res.status(200).json({
        success: false,
        message: "Mật khẩu không chính xác",
      });
    const hashedPassword = await argon2.hash(newPassword);
    const updated = {
      password: hashedPassword,
    };
    let updatedUser = await User.findOneAndUpdate(
      { username: username },
      updated,
      {
        new: true,
      }
    );
    return res.json({
      success: true,
      message: "Đã đổi mật khẩu thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


module.exports = router;
