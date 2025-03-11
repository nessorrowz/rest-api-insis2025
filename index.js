const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 1337;

// Middleware
app.use(express.json());

// Koneksi ke MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://fikriauliaa27:insistL@cluster-fikri.nvzlc.mongodb.net/INSIS?retryWrites=true&w=majority&appName=cluster-fikri",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Membuat schema dan model untuk User
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    category: { type: String, required: true },
  },
  { collection: "REST_API" }
);

const User = mongoose.model("User", userSchema);

// API untuk mendapatkan semua user
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API untuk menambahkan user baru
app.post("/users", async (req, res) => {
  try {
    const { name, email, category } = req.body;

    if (!name || !email || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = new User({ name, email, category });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// API untuk mendapatkan user berdasarkan ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API untuk mengupdate user berdasarkan ID
app.put("/users/:id", async (req, res) => {
  try {
    const { name, email, category } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, category },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Error updating user" });
  }
});

// API untuk menghapus user berdasarkan ID
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
