const { response } = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

// ROUTES
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API!",
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token

const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created...",
        authData,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  // Mock user
  const user = {
    id: 1,
    username: "brad",
    email: "brad@gmail.com",
  };

  jwt.sign({ user }, "secretkey", { expiresIn: "1min" }, (err, token) => {
    res.json({ token });
  });
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
