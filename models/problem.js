// models/problem.js

const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    flag: {
      type: String,
      required: true,
    },
    addilinks: {
      type: String,
    },
    link: {
      type: String,
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "questions" } 
);

const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;
