const express = require('express');
const router = express.Router();

//Auth Views
router.get('/login', (req, res) => {
    res.render('layout', { page: 'login' });
});
router.get('/dashboard', (req, res) => {
    res.render('layout', { page: 'dashboard' });
});
router.get('/forgot-password', (req, res) => {
    res.render('layout', { page: 'forgot-password' });
});

//User Views
router.get('/users', (req, res) => {
    res.render('layout', { page: 'users/list' });
});
router.get('/users/create', (req, res) => {
    res.render('layout', { page: 'users/create' });
});

//Permission Views
router.get('/permissions', (req, res) => {
    res.render('layout', { page: 'permissions/list' });
});
router.get('/permissions/create', (req, res) => {
    res.render('layout', { page: 'permissions/create' });
});
module.exports = router;