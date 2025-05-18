// queue/consumer.js
const amqp = require('amqplib');
const mongoose = require('mongoose');
const { Notification } = require('../db');
const emailHandler = require('../middleware/email');
const smsHandler = require('../middleware/sms');
const inappHandler = require('../middleware/inapp');

const rabbitmqUrl = 'amqp://guest:guest@localhost:5672';
const MongoDB_URI = 'mongodb+srv://ebhayme:desktop10@cluster0.fr06rkj.mongodb.net/';

let channel;
let connection;

const connectDB = async () => {
    try {
        await mongoose.connect(MongoDB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected (Consumer)');
    } catch (error) {
        console.error('MongoDB connection error (Consumer):', error.message);
        process.exit(1);
    }
};

const consumeNotifications = async () => {
    await connectDB();

    try {
        connection = await amqp.connect(rabbitmqUrl);
        channel = await connection.createChannel();
        await channel.assertQueue('notificationQueue', { durable: true });
        channel.prefetch(1);

        console.log(' [*] Waiting for messages in notificationQueue...');

        channel.consume(
            'notificationQueue',
            async (msg) => {
                if (msg) {
                    try {
                        const notification = JSON.parse(msg.content.toString());
                        console.log(' [x] Received notification:', notification);

                        switch (notification.type) {
                            case 'email':
                                console.log('Calling emailHandler...');
                                await emailHandler.sendEmailNotification(notification);
                                console.log('emailHandler finished.');
                                break;
                            case 'sms':
                                console.log('Calling smsHandler...');
                                await smsHandler.sendSmsNotification(notification);
                                console.log('smsHandler finished.');
                                break;
                            case 'inapp':
                                console.log('Calling inappHandler...');
                                await inappHandler.sendInAppNotification(notification);
                                console.log('inappHandler finished.');
                                break;
                            default:
                                console.warn(`Unknown notification type: ${notification.type}`);
                        }
                        channel.ack(msg);
                        console.log(' [✓] Processed and acknowledged:', notification._id);
                    } catch (error) {
                        console.error(' [!] Error processing notification:', error);
                        channel.nack(msg, false, false);
                        console.log(' [!] Negative acknowledged:', notification._id);
                    }
                }
            },
            { noAck: false }
        );

        connection.on('close', () => {
            console.warn('RabbitMQ connection closed. Attempting to reconnect consumer...');
            channel = null;
            setTimeout(consumeNotifications, 5000);
        });

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
        });

    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        setTimeout(consumeNotifications, 5000);
    }
};

consumeNotifications();