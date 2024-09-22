const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, validate: [isEmail, 'Please enter a valid email']},
    password: { type: String },
    isEmailConfirmed: { type: Boolean, default: false },
    confirmationToken: { type: String },
    profileImage: { type: String }
});

// Index definitions
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 1 });

module.exports = mongoose.model('User', UserSchema);
