require("dotenv").config();


const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const app = express();



const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'https://anastasiiabryiovska.github.io', 
    'https://dreamy-rugelach-8be11b.netlify.app' 
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};

app.use(cors(corsOptions)); 
app.use(express.json()); 



admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();




app.get("/api/reviews/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const snapshot = await db.collection("response").where("courseId", "==", courseId).get();

  
    if (snapshot.empty) return res.json([]);

    const reviews = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date ? data.date.toDate() : new Date(),
        dateFormatted: data.date ? 
          `${data.date.toDate().getDate().toString().padStart(2,'0')}.${(data.date.toDate().getMonth()+1).toString().padStart(2,'0')}.${data.date.toDate().getFullYear()}` 
          : ""
      };
    });

    reviews.sort((a, b) => b.date - a.date);
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не вдалося отримати відгуки" });
  }
});

app.post("/api/reviews", async (req, res) => {
  const { courseId, userId, message } = req.body;
  try {

    if (!message || message.length < 10 || message.length > 500) {
      return res.status(400).json({
        error: "Відгук має бути від 10 до 500 символів"
      });
    }

    const createdAt = new Date().toISOString();

    const docRef = await db.collection("response").add({
      courseId,
      userId,
      message,
      createdAt,
      date: admin.firestore.Timestamp.now()
    });

    res.json({
      id: docRef.id,
      createdAt
    }); 

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не вдалося додати відгук (введіть 10-500 символів)" });
  }
});

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};



app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from backend" });
});



app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "You are authenticated ",
    user: req.user,
  });
});



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



app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const snapshot = await db.collection("users")
      .where("email", "==", email)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({ error: "User already exists" });
    }

    const userRef = await db.collection("users").add({
      email,
      password, // для лаби ок (НЕ в проді)
      createdAt: new Date()
    });

    res.json({
      message: "User created",
      id: userRef.id,
      email
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const axios = require("axios");

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const snapshot = await db.collection("users")
      .where("email", "==", email)
      .where("password", "==", password)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = snapshot.docs[0].data();
    const uid = snapshot.docs[0].id;

    const token = jwt.sign(
      { uid, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get("/api/profile", verifyToken, (req, res) => {
  res.json({
    message: "Profile data",
    user: req.user,
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});