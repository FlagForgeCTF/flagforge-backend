import express, { type Express } from "express";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import problemsRoutes from "./routes/problems";
import connectDB from "./config/database";

dotenv.config();
const app: Express = express();

// Database Connection
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
);

// Initialize Passport
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/ctf', problemsRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CTF Platform running on port ${PORT}`);
});
