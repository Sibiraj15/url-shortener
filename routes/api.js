const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const { generateShortCode, isValidUrl, isValidCode } = require('../utils/helpers');

// GET /api/links - List all links
router.get('/links', async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// POST /api/links - Create a new link
router.post('/links', async (req, res) => {
  try {
    const { targetUrl, customCode } = req.body;

    // Validate target URL
    if (!targetUrl || !isValidUrl(targetUrl)) {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    let code = customCode;

    // Validate or generate code
    if (code) {
      // Validate custom code format
      if (!isValidCode(code)) {
        return res.status(400).json({ 
          error: 'Custom code must be 6-8 alphanumeric characters' 
        });
      }

      // Check if code already exists
      const existing = await Link.findOne({ code });
      if (existing) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    } else {
      // Generate unique code
      let attempts = 0;
      while (attempts < 10) {
        code = generateShortCode();
        const existing = await Link.findOne({ code });
        if (!existing) break;
        attempts++;
      }

      if (attempts === 10) {
        return res.status(500).json({ error: 'Failed to generate unique code' });
      }
    }

    // Create the link
    const link = new Link({
      code,
      targetUrl
    });

    await link.save();

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    res.status(201).json({
      code: link.code,
      targetUrl: link.targetUrl,
      shortUrl: `${baseUrl}/${link.code}`
    });
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ error: 'Failed to create link' });
  }
});

// GET /api/links/:code - Get stats for one code
router.get('/links/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json(link);
  } catch (error) {
    console.error('Error fetching link:', error);
    res.status(500).json({ error: 'Failed to fetch link' });
  }
});

// DELETE /api/links/:code - Delete a link
router.delete('/links/:code', async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({ code: req.params.code });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

module.exports = router;
