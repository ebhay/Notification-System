const amqp = require('amqplib');
require('dotenv').config();

const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost'; // Fallback

let channel;
let connection; // Added for reconnection

const connectQueue = async () => {
    try {
        connection = await amqp.connect(rabbitmqUrl); // Store the connection
        channel = await connection.createChannel();
        await channel.assertQueue('notificationQueue', { durable: true }); // Make queue durable
        console.log('Producer connected to RabbitMQ');

        // Handle connection close
        connection.on('close', () => {
            console.warn('RabbitMQ connection closed. Attempting to reconnect...');
            channel = null; // Reset channel
            setTimeout(connectQueue, 5000); // Reconnect after 5 seconds
        });

        connection.on('error', (err) => {
            console.error("RabbitMQ connection error:", err);
        });

    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        setTimeout(connectQueue, 5000); // Retry connection
    }
};

const sendToQueue = async (notification) => {
    if (!channel) {
        await connectQueue(); // Ensure connection is established
    }
    try {
        channel.sendToQueue(
            'notificationQueue',
            Buffer.from(JSON.stringify(notification)),
            {
                persistent: true, // Make messages persistent
            }
        );
        // console.log(`Sent to queue: ${JSON.stringify(notification)}`); //remove
    } catch (error) {
        console.error("Error sending to queue:", error);
        //  Don't try to reconnect here.  The connectQueue function handles it.
        throw error; // Re-throw to be caught in server.js
    }
};

// Connect on startup
connectQueue();

module.exports = { sendToQueue };
