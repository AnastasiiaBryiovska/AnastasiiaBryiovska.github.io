const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// підключення JSON ключа

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

// підключення до Firestore
const db = admin.firestore();

// створення сервера
const app = express();
app.use(cors());
app.use(express.json());


// Verify Firebase Auth Token (Middleware)
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};


// http://localhost:5000/api/message
app.get("/api/message", verifyToken, (req, res) => {
  res.json({message: "Hello from the backend!"});
});



// http://localhost:5000/api/protected
// Protected route (Only accessible with a valid token)
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "You have accessed a protected route!", user: req.user });
});


// http://localhost:5000/api/users
// Fetch data from Firestore
app.get("/api/users", verifyToken, async (req, res) => {
  const snapshot = await db.collection("users").get();
  const users = [];
  snapshot.forEach(doc => {
    users.push({ id: doc.id, ...doc.data() });
  });
  res.json(users);
});



// запуск сервера
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});