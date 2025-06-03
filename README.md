# Albion Market Tracker

This repository contains a simple web app scaffold for tracking Albion Online market orders.

## Structure

- `server/` – Node.js Express API that stores orders in memory.
- `client/` – Minimal HTML/JS front end that interacts with the API.

## Setup

1. Install dependencies for the server:
   ```bash
   cd server
   npm install
   npm start
   ```
   The server will start on port 3000.

2. Open `client/index.html` in your browser. The page allows you to add orders and
   lists existing ones using the API.

This scaffold can be extended with persistent storage, user accounts, and other
features as needed.
