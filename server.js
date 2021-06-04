const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// ROUTES
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API!",
  });
});

app.post("/api/login", (req, res) => {
  // Mock user
  const { id, username, email, password } = req.body;
  const user = {
    id,
    username,
    email,
    password,
  };

  const expirationTime = "1min";

  jwt.sign(
    { user },
    process.env.SECRET,
    { expiresIn: expirationTime },
    (err, token) => {
      if (err) {
        throw new Error("Error: ", err);
      } else {
        res.json(
          `User logged in for ${expirationTime} with username ${username} and token ${token}`
        );
      }
    }
  );
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
    res.sendStatus(403).json({ message: "Forbidden" });
  }
};

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403).json({ message: "Forbidden" });
    } else {
      res.json({
        message: "Post created...",
        authData,
      });
    }
  });
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
