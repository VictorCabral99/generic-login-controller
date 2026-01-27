const express = require('express');
const router = express.Router();

const permissionController = require('../../controllers/permission.controller');

router.get('/', permissionController.listarPermissoes);
router.post('/', permissionController.criarPermissao);
router.get('/:id', permissionController.listarPermissaoPorId);
router.put('/:id', permissionController.atualizarPermissao);
router.delete('/:id', permissionController.deletarPermissao);

module.exports = router;