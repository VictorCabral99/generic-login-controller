const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');

router.get('/usuarios', userController.listarUsuarios);
router.post('/usuarios', userController.criarUsuario);
router.get('/usuarios/:id', userController.listarUsuarioPorId);
router.put('/usuarios/:id', userController.atualizarUsuario);
router.delete('/usuarios/:id', userController.deletarUsuario);

module.exports = router;