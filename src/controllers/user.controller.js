const express = require('express');
const router = express.Router();

// Array para armazenar usuários (em produção usar banco de dados)
let usuarios = [];
let idContador = 1;

const listarUsuarios = (req, res) => {
    res.json({ usuarios });
};

const criarUsuario = (req, res) => {
    const { email, senha } = req.body;

    // Validar dados
    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    // Verificar se email já existe
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Criar novo usuário
    const novoUsuario = {
        id: idContador++,
        email,
        senha // Em produção, usar bcrypt para hash
    };

    usuarios.push(novoUsuario);
    res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: novoUsuario });
};

const listarUsuarioPorId = (req, res) => {
    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    
    if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ usuario });
};

const atualizarUsuario = (req, res) => {
    const { email, senha } = req.body;
    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));

    if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (email) usuario.email = email;
    if (senha) usuario.senha = senha;

    res.json({ mensagem: 'Usuário atualizado com sucesso', usuario });
};

const deletarUsuario = (req, res) => {
    const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const usuarioDeletado = usuarios.splice(index, 1);
    res.json({ mensagem: 'Usuário deletado com sucesso', usuario: usuarioDeletado[0] });
};

module.exports = {
    listarUsuarios,
    criarUsuario,
    listarUsuarioPorId,
    atualizarUsuario,
    deletarUsuario
};