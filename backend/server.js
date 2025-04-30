import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// 🔐 Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB connection using Atlas URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

/* =======================
   📦 Mongoose Schemas
========================== */
const CategorySchema = new mongoose.Schema({
  name: String,
  spent: Number,
});
const Category = mongoose.model("Category", CategorySchema);

const BudgetSchema = new mongoose.Schema({
  totalBudget: Number,
  savingsGoal: Number,
});
const Budget = mongoose.model("Budget", BudgetSchema);

/* =======================
   🛣️ API ROUTES
========================== */

// 📁 Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📝 Overwrite categories
app.post("/api/categories", async (req, res) => {
  try {
    await Category.deleteMany(); // replace with new
    const newCategories = await Category.insertMany(req.body);
    res.status(201).json(newCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 💰 Get current budget
app.get("/api/budget", async (req, res) => {
  try {
    const budget = await Budget.findOne();
    res.json(budget || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 💾 Save/update budget
app.post("/api/budget", async (req, res) => {
  try {
    let budget = await Budget.findOne();
    if (budget) {
      budget.totalBudget = req.body.totalBudget;
      budget.savingsGoal = req.body.savingsGoal;
    } else {
      budget = new Budget(req.body);
    }
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   🚀 Start Server
========================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
