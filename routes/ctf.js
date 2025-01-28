// routes/ctf.js
const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

router.get('/challenges', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  
  const challenges = await Challenge.find();
  res.json(challenges);
});

module.exports = router;