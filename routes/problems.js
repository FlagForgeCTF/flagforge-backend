const express = require("express");
const router = express.Router();
const Problem = require("../models/problem");

// GET:/problems
router.get("/problems", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const problems = await Problem.find().select("-flag").skip(skip).limit(limit);
    res.json({ success: true, data: problems });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// GET:/problems/{id}
router.get("/problem/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select("-flag");
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// POST:/problem
router.post("/problem", async (req, res) => {
  try {
    const { title, description, category, points, flag } = req.body;

    if (!title || !description || !category || !points || !flag) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newProblem = new Problem(req.body);
    await newProblem.save();

    res.status(201).json({ success: true, message: "Problem created successfully", data: newProblem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// PUT:/problem/{id}
router.put("/problem/:id", async (req, res) => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedProblem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    res.json({ success: true, message: "Problem updated successfully", data: updatedProblem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// DELETE:/problem/{id}
router.delete("/problem/:id", async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.json({ success: true, message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

module.exports = router;
