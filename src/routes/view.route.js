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
router.get('/reset-password', (req, res) => {
    res.render('layout', { page: 'reset-password' });
});

//User Views
router.get('/users', (req, res) => {
    res.render('layout', { page: 'users/list' });
});
router.get('/users/create', (req, res) => {
    res.render('layout', { page: 'users/upsert', id: null });
});
router.get('/users/edit/:id', (req, res) => {
    res.render('layout', { page: 'users/upsert', id: req.params.id });
});

//Permission Views
router.get('/permissions', (req, res) => {
    res.render('layout', { page: 'permissions/list' });
});
router.get('/permissions/create', (req, res) => {
    res.render('layout', { page: 'permissions/upsert', id: null });
});
router.get('/permissions/edit/:id', (req, res) => {
    res.render('layout', { page: 'permissions/upsert', id: req.params.id });
});
module.exports = router;