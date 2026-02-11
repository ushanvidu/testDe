
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String }, // Redundant but good for quick log reading
    action: { type: String, required: true }, // e.g., 'PURCHASE', 'ADD_ITEM'
    details: { type: Object }, // Flexible JSON data about the action
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);