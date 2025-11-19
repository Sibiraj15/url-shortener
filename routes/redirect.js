const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

// GET /:code - Redirect to target URL
router.get('/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Update click count and last clicked time
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    // Perform 302 redirect
    res.redirect(302, link.targetUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Redirect failed' });
  }
});

module.exports = router;