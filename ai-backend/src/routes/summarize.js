const express = require('express');
const router = express.Router();

console.log("Summarize route module loaded!");

// Minimal GET test
router.get('/test', (req, res) => {
  res.json({ msg: "Summarize GET is working!" });
});

module.exports = router;
