const { Notification } = require('../db');

const sendInAppNotification = async (notification) => {
    console.log('Processing in-app notification:', notification);
    try {
        await Notification.findOneAndUpdate(
            { _id: notification._id },
            { status: 'sent' },
            { new: true }
        );
        console.log(`In-app notification status updated for ${notification._id}`);
    } catch (error) {
        console.error('Error updating in-app notification status:', error);
        await Notification.findOneAndUpdate(
            { _id: notification._id },
            { status: 'failed' },
            { new: true }
        );
        console.error(`In-app notification status set to failed for ${notification._id}`);
    }
};

module.exports = { sendInAppNotification };
