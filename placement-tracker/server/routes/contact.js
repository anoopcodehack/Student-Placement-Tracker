
const express = require('express');
const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields' 
      });
    }

    // Log the message (email sending optional)
    console.log('📬 New Contact Message:');
    console.log(`From: ${name} (${email})`);
    console.log(`Phone: ${phone || 'Not provided'}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    res.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

module.exports = router;