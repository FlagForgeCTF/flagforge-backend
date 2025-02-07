import express, { type Express } from "express";
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/auth.routes";
import problemsRoutes from "./routes/problems.routes";
import userRoutes from "./routes/user.routes";
import connectDB from "./config/database";
import { config } from "./utils/config";
import cookieparser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

const app: Express = express();

// Database Connection
connectDB();


app.use(cors({
  origin: ["http://localhost:5173", "https://flagforge.xyz"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

// app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// Session configuration
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Initialize Passport
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/ctf", problemsRoutes);
app.use("/user", userRoutes);

const PORT = config.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CTF Platform running on port ${PORT}`);
});
