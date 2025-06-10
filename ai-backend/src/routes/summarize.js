const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ msg: "Summarize GET is working!" });
});

router.post('/', (req, res) => {
  res.json({ msg: "Summarize POST is working!" });
});

module.exports = router;
