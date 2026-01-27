const express = require('express');
const router = express.Router();

// Array para armazenar permissões (em produção usar banco de dados)
let permissoes = [];
let idContador = 1;

const listarPermissoes = (req, res) => {
    res.json({ permissoes });
};

const criarPermissao = (req, res) => {
    const { nome, descricao } = req.body;
    const novaPermissao = { id: idContador++, nome, descricao };
    permissoes.push(novaPermissao);
    res.status(201).json({ mensagem: 'Permissão criada com sucesso', permissao: novaPermissao });
};
const listarPermissaoPorId = (req, res) => {
    const permissao = permissoes.find(p => p.id === parseInt(req.params.id));
    if (!permissao) {
        return res.status(404).json({ mensagem: 'Permissão não encontrada' });
    }
    res.json({ permissao });
};
const atualizarPermissao = (req, res) => {
    const { nome, descricao } = req.body;
    const permissao = permissoes.find(p => p.id === parseInt(req.params.id));
    if (!permissao) {
        return res.status(404).json({ mensagem: 'Permissão não encontrada' });
    }
    permissao.nome = nome;
    permissao.descricao = descricao;
    res.json({ mensagem: 'Permissão atualizada com sucesso', permissao });
};
const deletarPermissao = (req, res) => {
    const permissaoIndex = permissoes.findIndex(p => p.id === parseInt(req.params.id));
    if (permissaoIndex === -1) {
        return res.status(404).json({ mensagem: 'Permissão não encontrada' });
    }
    permissoes.splice(permissaoIndex, 1);
    res.json({ mensagem: 'Permissão deletada com sucesso' });
};

module.exports = {
    listarPermissoes,
    criarPermissao,
    listarPermissaoPorId,
    atualizarPermissao,
    deletarPermissao
};