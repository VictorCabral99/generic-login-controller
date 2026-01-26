const express = require('express');
const router = express.Router();

router.get('/login', (req, res) =>{ 
  res.render('layout', { page: 'login' });
});
router.get('/forgot-password', (req, res) =>{ 
  res.render('layout', { page: 'forgot-password' });
});
router.post('/login', () =>{ });
router.post('/register', () =>{ });
router.get('/logout', () =>{ });

module.exports = router;