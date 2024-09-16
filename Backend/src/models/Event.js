const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String },
    capacity: { type: Number, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]  // Default to an empty array
});

module.exports = mongoose.model('Event', EventSchema);
