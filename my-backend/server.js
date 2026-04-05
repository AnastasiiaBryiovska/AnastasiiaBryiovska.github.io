require("dotenv").config();


const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const app = express();

let users = []; 

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://anastasiiabryiovska.github.io', // ваш старий домен
    'https://dreamy-rugelach-8be11b.netlify.app' // ДОДАЙТЕ ЦЕЙ ДОМЕН NETLIFY
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};

app.use(cors(corsOptions)); // Обов'язково першим
app.use(express.json()); 



// Firebase Admin init (SAFE VERSION)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();




// Маршрут для отримання відгуків по конкретному курсу
app.get("/api/reviews/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const snapshot = await db.collection("response").where("courseId", "==", courseId).get();

    // якщо відгуків немає, повертаємо пустий масив замість 404
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
    console.log("PROJECT ID:", process.env.FIREBASE_PROJECT_ID);
    console.log(process.env.FIREBASE_PRIVATE_KEY);
    return res.status(401).json({ message: "Invalid tokenn" });
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