# Safe Web Forum

Safe Web Forum is a full-stack web application developed during a hackathon.

The project implements a forum platform with a focus on content safety, modular architecture, and a clean separation between frontend and backend.

The system integrates an AI-based content analysis API to evaluate user-generated content and identify potentially harmful or sensitive posts.

The project is currently a work in progress (WIP).

---

## Features

- User authentication (registration and login)
- Topic-based forum structure
- Post creation and retrieval
- Like system for posts
- AI-powered content analysis:
  - Detection of potentially harmful or offensive content
  - Identification of sensitive content that may indicate distress or need for support
- RESTful API architecture

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- bcrypt
- dotenv
- cors

---

## Project Structure

safe-web-forum/
├── client/        # React frontend (Vite)
└── server/        # Express API with MongoDB

---

## Getting Started

### Prerequisites
- Node.js v20.19 or higher
- MongoDB (local instance or cloud service)

### Installation

git clone https://github.com/YochevedPhilip/safe-web-forum
cd safe-web-forum

Install dependencies:

cd client
npm install

cd ../server
npm install

---

### Environment Variables

The backend requires the following environment variables:

PORT=                # Server port
CLIENT_URL=          # Frontend URL (for CORS configuration)
MONGODB_URI=         # MongoDB connection string
JWT_SECRET=          # Secret key for JWT signing


---

### Running the Application

Backend:

cd server
npm run dev

Frontend:

cd client
npm run dev

---

## Content Safety

A core goal of this project is to promote safer online discussions.

User-generated content is analyzed using an AI-based API to detect harmful language and identify sensitive content that may require moderation or user support.

The architecture is designed to allow future expansion with moderation workflows and automated responses.

---

## Project Status

This project was created as part of a hackathon and is currently under active development.

---

## Author

Hackathon Project - Safe Web Forum
