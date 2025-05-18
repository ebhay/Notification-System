const express = require('express');
const { Notification } = require('./db'); // Import only what's needed
const { connectDB } = require('./db');
connectDB();

const { sendToQueue } = require('./queue/producer');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/notifications', async (req, res) => {
    try {
        const { userId, type, subject, message } = req.body;

        if (!userId || !type || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newNotification = new Notification({ userId, type, subject, message });
        const savedNotification = await newNotification.save();  // Await the save operation

        console.log('Notification saved to MongoDB:', savedNotification); // Log when saved

        await sendToQueue(savedNotification); // Await the queue operation

        res.status(200).json({ message: 'Notification queued successfully!' });

    } catch (error) {
        console.error('Error creating and queuing notification:', error);
        res.status(500).json({ error: 'Failed to create and queue notification', details: error.message });
    }
});

app.get('/users/:id/notifications', async (req, res) => {
    try {
        const userId = req.params.id;
        const notifications = await Notification.find({ userId });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});