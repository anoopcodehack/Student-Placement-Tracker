// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const crypto = require('crypto');
// const User = require('../models/User');
// const { protect } = require('../middleware/auth');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
// };

// const googleClientId = process.env.GOOGLE_CLIENT_ID;
// const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
// const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || `${process.env.SERVER_URL || process.env.API_URL || 'http://localhost:5000'}/api/auth/google/callback`;

// router.use(passport.initialize());

// if (googleClientId && googleClientSecret) {
//   passport.use(new GoogleStrategy({
//     clientID: googleClientId,
//     clientSecret: googleClientSecret,
//     callbackURL: googleCallbackUrl,
//   }, async (accessToken, refreshToken, profile, done) => {
//     try {
//       const email = profile.emails?.[0]?.value;
//       if (!email) return done(new Error('Google account did not return email')); 

//       let user = await User.findOne({ email });
//       if (!user) {
//         const randomPassword = crypto.randomBytes(20).toString('hex');
//         user = await User.create({
//           name: profile.displayName || `${profile.name?.givenName || 'Google'} ${profile.name?.familyName || 'User'}`,
//           email,
//           password: randomPassword,
//           role: 'viewer',
//         });
//       }
//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   }));
// }

// // POST /api/auth/register
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, message: 'Please fill all fields' });
//     }
//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

//     const user = await User.create({ name, email, password, role: role || 'viewer' });
//     res.status(201).json({
//       success: true,
//       token: generateToken(user._id),
//       user: { _id: user._id, name: user.name, email: user.email, role: user.role }
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // POST /api/auth/login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: 'Please provide email and password' });
//     }
//     const user = await User.findOne({ email });
//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ success: false, message: 'Invalid email or password' });
//     }
//     res.json({
//       success: true,
//       token: generateToken(user._id),
//       user: { _id: user._id, name: user.name, email: user.email, role: user.role }
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // GET /api/auth/google
// router.get('/google', (req, res, next) => {
//   if (!googleClientId || !googleClientSecret) {
//     const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
//     return res.redirect(`${clientUrl}/login?error=google_not_configured`);
//   }
//   return passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
// });

// // GET /api/auth/google/callback
// router.get('/google/callback', passport.authenticate('google', {
//   session: false,
//   failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_auth_failed`,
// }), (req, res) => {
//   const user = req.user;
//   const token = generateToken(user._id);
//   const redirectUrl = new URL(process.env.CLIENT_URL || 'http://localhost:3000');
//   redirectUrl.pathname = '/login';
//   redirectUrl.searchParams.set('token', token);
//   redirectUrl.searchParams.set('user', JSON.stringify({ _id: user._id, name: user.name, email: user.email, role: user.role }));
//   res.redirect(redirectUrl.toString());
// });

// // GET /api/auth/me
// router.get('/me', protect, async (req, res) => {
//   res.json({ success: true, user: req.user });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/User');
const Student = require('../models/Student'); // ✅ added for rollNo linking
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
};

const googleClientId     = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl  = process.env.GOOGLE_CALLBACK_URL ||
  `${process.env.SERVER_URL || process.env.API_URL || 'http://localhost:5000'}/api/auth/google/callback`;

router.use(passport.initialize());

// ── Google OAuth Strategy ──
if (googleClientId && googleClientSecret) {
  passport.use(new GoogleStrategy({
    clientID:     googleClientId,
    clientSecret: googleClientSecret,
    callbackURL:  googleCallbackUrl,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('Google account did not return email'));

      let user = await User.findOne({ email });
      if (!user) {
        const randomPassword = crypto.randomBytes(20).toString('hex');
        user = await User.create({
          name:     profile.displayName || `${profile.name?.givenName || 'Google'} ${profile.name?.familyName || 'User'}`,
          email,
          password: randomPassword,
          role:     'viewer',
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
}

// ══════════════════════════════════════════
// POST /api/auth/register
// ── Handles both Viewer and Student signup
// ══════════════════════════════════════════
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, rollNo } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    let isStudent = false;
    let studentRef = null;

    // ── If rollNo provided → Student signup ──
    if (rollNo && rollNo.trim() !== '') {
      const student = await Student.findOne({
        rollNo: rollNo.trim().toUpperCase()
      });

      // Roll number not found in database
      if (!student) {
        return res.status(400).json({
          success: false,
          message: `Roll number "${rollNo.toUpperCase()}" not found! Make sure your admin has added you as a student first.`
        });
      }

      // Check if this student is already linked to another account
      const alreadyLinked = await User.findOne({ studentRef: student._id });
      if (alreadyLinked) {
        return res.status(400).json({
          success: false,
          message: 'This roll number is already linked to another account!'
        });
      }

      isStudent  = true;
      studentRef = student._id;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'viewer', // always viewer, admin is set manually
      isStudent,
      studentRef,
    });

    // Return response with isStudent flag
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        isStudent: user.isStudent,
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════
// POST /api/auth/login
// ══════════════════════════════════════════
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        isStudent: user.isStudent, // ✅ send isStudent in login too
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════
// GET /api/auth/google
// ══════════════════════════════════════════
router.get('/google', (req, res, next) => {
  if (!googleClientId || !googleClientSecret) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    return res.redirect(`${clientUrl}/login?error=google_not_configured`);
  }
  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })(req, res, next);
});

// ══════════════════════════════════════════
// GET /api/auth/google/callback
// ══════════════════════════════════════════
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    const user  = req.user;
    const token = generateToken(user._id);
    const redirectUrl = new URL(process.env.CLIENT_URL || 'http://localhost:3000');
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('user', JSON.stringify({
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      role:      user.role,
      isStudent: user.isStudent,
    }));
    res.redirect(redirectUrl.toString());
  }
);

// ══════════════════════════════════════════
// GET /api/auth/me
// ══════════════════════════════════════════
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;