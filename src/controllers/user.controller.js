const express = require('express');
const router = express.Router();

// Array para armazenar usuários (em produção usar banco de dados)
let usuarios = [];
let idContador = 1;

const listarUsuarios = (req, res) => {
    res.json({ usuarios });
};

const criarUsuario = (req, res) => {
    const { username, email, senha, permissoes = [] } = req.body;

    // Validar dados
    if (!username || !email || !senha) {
        return res.status(400).json({ erro: 'Username, email e senha são obrigatórios' });
    }

    // Verificar se email já existe
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Criar novo usuário
    const novoUsuario = {
        id: idContador++,
        username,
        email,
        senha, // Em produção, usar bcrypt para hash
        permissoes
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
    const { username, email, senha, permissoes } = req.body;
    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));

    if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (username) usuario.username = username;
    if (email) usuario.email = email;
    if (senha) usuario.senha = senha;
    if (permissoes) usuario.permissoes = permissoes;

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