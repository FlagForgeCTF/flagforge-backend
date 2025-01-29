import mongoose, { Schema, model, models } from "mongoose";
import {Users} from "@/interfaces";

const userSchema = new Schema<Users>(
    {
        name: {
          type: String,
          required: true,
          trim: true, // Optional: Remove whitespace from the start and end
        },
        email: {
          type: String,
          required: true,
          unique: true,
          lowercase: true, // Optional: Store emails in lowercase
          trim: true,
        },
        image: {
          type: String,
          default: "", // Optional: Default empty string if no image provided
        },
        role: {
          type: String,
          default: "User",
          enum: ["User", "Admin"], // Define allowed roles
        },
        totalScore: {
          type: Number,
          default: 0, // Default score for new users
          min: 0, // Ensure score cannot be negative
        },
      },
      {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
      }
    );
    
const User = models.User || model("User", userSchema);
export default User;
