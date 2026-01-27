const express = require('express');
const router = express.Router();

const authRoutes = require('./api/auth.route');
const userRoutes = require('./api/user.route');
const permissionRoutes = require('./api/permission.route');

router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/permissoes', permissionRoutes);

module.exports = router;