const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

// Firebase Admin init (SAFE VERSION)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

const app = express();

app.use(cors());
app.use(express.json());


// =====================
// Firebase Auth Middleware
// =====================
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// =====================
// TEST ROUTE
// =====================
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from backend 🚀" });
});


// =====================
// PROTECTED ROUTE
// =====================
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "You are authenticated 🔐",
    user: req.user,
  });
});


// =====================
// FIRESTORE USERS
// =====================
app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});