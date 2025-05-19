# Notification Service with RabbitMQ

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Node.js-based notification service that demonstrates asynchronous processing using RabbitMQ and data persistence with MongoDB.

## 📋 Overview

This service provides a robust system for sending and managing email, SMS, and in-app notifications through an asynchronous queue-based architecture. It leverages RabbitMQ for reliable message queuing and MongoDB for persistent storage of notification data.

Key features include:
- Asynchronous notification processing
- Multiple notification channels (email, SMS, in-app)
- Persistent storage of notification history
- RESTful API for notification management

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **RabbitMQ** - Message broker for asynchronous processing
- **MongoDB** - Database for notification storage
- **Mongoose** - MongoDB object modeling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (>= 18)
- npm
- MongoDB (running locally or remotely)
- RabbitMQ (running with Management Plugin enabled)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your_repository_url>
cd notification-service
```

### 2. Install Dependencies

```bash
npm install
cd queue
npm install amqplib dotenv mongoose
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notificationsDB
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

## 🏃‍♂️ Running the Application

You'll need to run both the API server and the RabbitMQ consumer in separate terminals:

### Terminal 1 - API Server

```bash
node server.js
```

### Terminal 2 - RabbitMQ Consumer

```bash
node queue/consumer.js
```

## 📝 API Documentation

### Send a Notification

**Endpoint:** `POST /notifications`

**Description:** Creates and queues a new notification.

**Request Body:**

```json
{
  "userId": "string",
  "type": "email|sms|inapp",
  "subject": "string", // Required for email notifications
  "message": "string"
}
```

**Response:**

```json
{
  "success": true,
  "notification": {
    "_id": "string",
    "userId": "string",
    "type": "string",
    "subject": "string",
    "message": "string",
    "createdAt": "datetime",
    "status": "queued"
  }
}
```

### Get User Notifications

**Endpoint:** `GET /users/:userId/notifications`

**Description:** Retrieves all notifications for a specific user.

**Response:**

```json
{
  "success": true,
  "notifications": [
    {
      "_id": "string",
      "userId": "string",
      "type": "string",
      "subject": "string",
      "message": "string",
      "createdAt": "datetime",
      "status": "string"
    }
  ]
}
```

## 🧪 Testing with Postman

Use the following requests to test the notification service:

### Email Notification

**Method:** POST  
**URL:** `http://localhost:5000/notifications`  
**Body:**
```json
{
  "userId": "testUser",
  "type": "email",
  "subject": "Test Email",
  "message": "This is a test email notification."
}
```

### SMS Notification

**Method:** POST  
**URL:** `http://localhost:5000/notifications`  
**Body:**
```json
{
  "userId": "testUser",
  "type": "sms",
  "message": "This is a test SMS notification."
}
```

### In-App Notification

**Method:** POST  
**URL:** `http://localhost:5000/notifications`  
**Body:**
```json
{
  "userId": "testUser",
  "type": "inapp",
  "message": "This is a test in-app notification."
}
```

### Get User Notifications

**Method:** GET  
**URL:** `http://localhost:5000/users/testUser/notifications`

## 📊 Monitoring

Monitor your RabbitMQ queues and message flow through the RabbitMQ Management Dashboard:

- **URL:** [http://localhost:15672](http://localhost:15672)
- **Default credentials:** `guest` / `guest`

## 📁 Project Structure

```
notification-service/
├── config/
│   ├── db.js           # MongoDB connection
│   └── rabbitmq.js     # RabbitMQ connection
├── middleware/
│   ├── emailService.js # Email notification handler
│   ├── smsService.js   # SMS notification handler
│   └── inAppService.js # In-app notification handler
├── models/
│   └── notification.js # Notification schema
├── queue/
│   ├── consumer.js     # RabbitMQ message consumer
│   └── producer.js     # RabbitMQ message producer
├── routes/
│   └── notifications.js # API routes
├── .env                # Environment variables
├── package.json        # Dependencies
└── server.js           # Application entry point
```

## 🔒 Security Considerations

- In production, replace default RabbitMQ credentials with secure ones
- Consider implementing authentication for the notification API
- Use environment variables for all sensitive information
- Implement rate limiting to prevent abuse

## 🚀 Advanced Implementation Ideas

- Add notification templates
- Implement notification priority levels
- Add batch notification processing
- Implement webhooks for notification delivery
- Add real-time notification delivery with WebSockets
- Implement notification preferences per user

## ⚠️ Notes

- This implementation includes simulation code for notification delivery. In a production environment, you'll need to implement actual delivery logic using appropriate services.
- Consider adding robust error handling, logging, and retry mechanisms for production use.
- The consumer processes messages sequentially. For higher throughput, consider implementing multiple consumers or worker threads.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Your Name]
