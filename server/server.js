const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
require("dotenv").config(); // ✅ Load .env variables

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI; // ✅ Use correct key

// ✅ Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ====== MODELS ======
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  filePath: String,
  coverImagePath: String,
});
const Book = mongoose.model("Book", BookSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// ====== MULTER STORAGE ======
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// ====== ROUTES ======

// GET all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// POST book (PDF + cover image)
app.post(
  "/api/books",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, author, category } = req.body;
      const filePath = req.files["file"]?.[0]?.path || "";
      const coverImagePath = req.files["coverImage"]?.[0]?.path || "";

      const newBook = new Book({
        title,
        author,
        category,
        filePath,
        coverImagePath,
      });

      await newBook.save();
      res.json({ message: "Book uploaded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// POST /register
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

// POST /login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// Define ContactMessage schema and model
const contactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  submittedAt: { type: Date, default: Date.now },
});

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);


const AccessLogSchema = new mongoose.Schema({
  name: String,
  email: String,
  bookTitle: String,
  action: String,
  date: { type: Date, default: Date.now }
});
const AccessLog = mongoose.model("AccessLog", AccessLogSchema);



app.post("/api/track-access", async (req, res) => {
  const { name, email, bookTitle, action } = req.body;

  try {
    const accessLog = new AccessLog({ name, email, bookTitle, action });
    await accessLog.save();
    res.status(200).json({ message: "Access tracked successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to track access" });
  }
});


// POST endpoint to handle contact messages
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: "Message received" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});




// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
