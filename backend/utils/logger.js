// backend/utils/logger.js
const Log = require('../models/log');

const logActivity = async (user, action, details) => {
    try {
        await Log.create({
            userId: user.id || user._id,
            userEmail: user.email,
            action: action,
            details: details
        });
        console.log(`[AUDIT LOG] ${user.email} performed ${action}`);
    } catch (err) {
        console.error("Logging failed:", err);
    }
};

module.exports = logActivity;