const { Notification } = require('../db');

const sendSmsNotification = async (notification) => {
    console.log('Sending SMS notification:', notification);
    try {
        // Simulate SMS sending
        console.log(`SMS sent to user ${notification.userId} with message: ${notification.message}`);
        await Notification.findOneAndUpdate(
            { _id: notification._id },
            { status: 'sent' },
            { new: true }
        );
        console.log(`SMS notification status updated for ${notification._id}`);
    } catch (error) {
        console.error('Error sending SMS:', error);
        await Notification.findOneAndUpdate(
            { _id: notification._id },
            { status: 'failed' },
            { new: true }
        );
        console.error(`SMS notification status set to failed for ${notification._id}`);
    }
};

module.exports = { sendSmsNotification };
