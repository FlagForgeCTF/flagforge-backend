import express from 'express';
import passport from '@/config/passport'; // Import the passport configuration
import session from 'express-session';
import authRoutes from '@/routes/auth';
import db from '@/config/db';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'abc', resave: false, saveUninitialized: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes
app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
