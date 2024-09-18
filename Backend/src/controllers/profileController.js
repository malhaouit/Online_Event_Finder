// src/controllers/profileController.js

const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// File upload configuration for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profileImages/'); // Separate directory for profile images
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit the file size to 2MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('profileImage');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Controller to handle profile image update
exports.updateProfileImage = async (req, res) => {
  const userId = req.params.userId;

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'Image size should be less than 2MB.' });
      }
      return res.status(400).json({ msg: 'Error uploading image.' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No image provided.' });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profileImage: `uploads/profileImages/${req.file.filename}` },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found' });
      }

      res.json(updatedUser); // Return the updated user data
    } catch (error) {
      console.error('Error updating profile image:', error.message);
      res.status(500).send('Server error');
    }
  });
};

// Controller to fetch user profile
exports.getProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).send('Server error');
  }
};