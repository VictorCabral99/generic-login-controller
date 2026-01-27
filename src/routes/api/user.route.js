const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');

router.get('/', userController.listarUsuarios);
router.post('/', userController.criarUsuario);
router.get('/:id', userController.listarUsuarioPorId);
router.put('/:id', userController.atualizarUsuario);
router.delete('/:id', userController.deletarUsuario);

module.exports = router;