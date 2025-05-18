const { Notification } = require('../db');

const sendEmailNotification = async (notification) => {
    console.log('Sending email notification:', notification);
    try {
        // Simulate email sending
        console.log(`Email sent to user ${notification.userId} with subject: ${notification.subject}`);
        await Notification.findOneAndUpdate(
            { _id: notification._id },
            { status: 'sent' },
            { new: true } // Return the modified document
        );
        console.log(`Email notification status updated for ${notification._id}`);
    } catch (error) {
        console.error('Error sending email:', error);
        await Notification.findOneAndUpdate(
            { _id: notification._id },
            { status: 'failed' },
            { new: true }
        );
        console.error(`Email notification status set to failed for ${notification._id}`);
    }
};

module.exports = { sendEmailNotification };
