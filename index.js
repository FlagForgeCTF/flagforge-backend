const express = require('express');
const passport = require('passport');
const session = require('express-session'); 
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); 
const problemsRoutes = require('./routes/problems');
const connectDB = require('./config/database');

dotenv.config();
const app = express(); 

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CTF Platform running on port ${PORT}`);
});
