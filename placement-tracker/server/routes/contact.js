// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');

// // POST /api/contact
// router.post('/', async (req, res) => {
//   try {
//     const { name, email, phone, subject, message } = req.body;

//     if (!name || !email || !subject || !message) {
//       return res.status(400).json({ success: false, message: 'Please fill all required fields' });
//     }

//     // ── Send email if configured ──
//     if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });

//       await transporter.sendMail({
//         from: `"PlaceTrack Contact" <${process.env.EMAIL_USER}>`,
//         to: process.env.EMAIL_USER, // sends to yourself
//         replyTo: email,
//         subject: `PlaceTrack Contact: ${subject}`,
//         html: `
//           <h2>New Contact Form Submission</h2>
//           <p><strong>Name:</strong> ${name}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
//           <p><strong>Subject:</strong> ${subject}</p>
//           <p><strong>Message:</strong></p>
//           <p>${message}</p>
//         `,
//       });
//     }

//     res.json({ success: true, message: 'Message sent successfully!' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;

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