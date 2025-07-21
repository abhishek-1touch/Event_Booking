# 🎟️ Event Booking Platform – MERN Stack

A scalable event booking platform supporting real-time seat locking, secure payments, QR ticketing, microservice architecture, and CI/CD deployment.

---

## 🚀 Overview

- **Frontend:** React.js + Axios
- **Backend:** Node.js + Express (Microservices)
- **Database:** MongoDB (via Mongoose)
- **Caching:** Redis (seat locking)
- **Messaging:** RabbitMQ / NATS
- **CI/CD:** GitHub Actions → Docker Hub → Kubernetes (EKS)

---

## 📐 Architecture Design

### 🧱 High-Level Design (HLD)

- Microservices architecture
- Modular services for Auth, Events, Bookings, Payments, Notifications
- API Gateway for routing
- Redis-based seat locking
- Deployment-ready via Docker and Kubernetes

📎 **See HLD Diagram**  
Included in: `Event-booking-architecture` [↗️ open in canvas]

---

### 🔍 Low-Level Design (LLD)

- JWT authentication
- Redis seat locking TTL
- Booking lifecycle (pending → confirmed)
- Payment via Razorpay/Stripe
- QR ticket generation + validation
- Email/SMS notifications via SendGrid/Twilio

📎 **See LLD Flow + APIs**  
Included in: `Event-booking-architecture` [↗️ open in canvas]

---

### ☁️ Deployment Architecture

- GitHub Actions → Docker Hub → EKS
- NGINX Ingress + API Gateway
- MongoDB Atlas, Redis Cloud, RabbitMQ Cluster

📎 **See Deployment Diagram**  
Included in: `Event-booking-architecture` [↗️ open in canvas]

---

## 📂 Current Services

| Service               | Description                    |
|-----------------------|--------------------------------|
| `auth-service`        | User login/signup, JWT         |
| `event-service`       | Event and showtime management  |
| `booking-service`     | Booking flow & status          |
| `payment-service`     | Razorpay/Stripe integration    |
| `notification-service`| Email/SMS booking updates      |
| `qr-service`          | QR code ticket validation      |
| `seat-lock-service`   | Redis-based seat locking       |

---

## 📅 Last Updated

**July 21, 2025**

---

## 🛠️ Next Steps

- [ ] Setup GitHub monorepo with Docker for all services
- [ ] Scaffold `auth-service` with JWT and MongoDB
- [ ] Add frontend show selection and booking UI
