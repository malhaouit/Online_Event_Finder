const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, validate: [isEmail, 'Please enter a valid email']},
    password: { type: String, required: [true, 'Password is required'], minlength: 4 }
});

// Index definitions
//UserSchema.index({ _id: 1 });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 1 }); 

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);
