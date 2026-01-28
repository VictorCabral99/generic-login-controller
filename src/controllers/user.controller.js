const express = require('express');
const router = express.Router();
const db = require('../../firebase-config');

// Listar todos os usuários
const listarUsuarios = async (req, res) => {
    try {
        const snapshot = await db.collection('usuarios').get();
        const usuarios = [];
        
        snapshot.forEach(doc => {
            usuarios.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        res.json({ usuarios });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ erro: 'Erro ao buscar usuários' });
    }
};

// Criar novo usuário
const criarUsuario = async (req, res) => {
    try {
        const { username, email, senha, permissoes = [] } = req.body;

        // Validar dados
        if (!username || !email || !senha) {
            return res.status(400).json({ 
                erro: 'Username, email e senha são obrigatórios' 
            });
        }

        // Verificar se email já existe
        const usuarioExistente = await db.collection('usuarios')
            .where('email', '==', email)
            .get();

        if (!usuarioExistente.empty) {
            return res.status(400).json({ 
                erro: 'Email já cadastrado' 
            });
        }

        // Criar novo usuário
        const novoUsuario = {
            username,
            email,
            senha,
            permissoes,
            criadoEm: new Date()
        };

        const docRef = await db.collection('usuarios').add(novoUsuario);

        res.status(201).json({ 
            mensagem: 'Usuário criado com sucesso', 
            usuario: {
                id: docRef.id,
                ...novoUsuario
            }
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
};

// Listar usuário por ID
const listarUsuarioPorId = async (req, res) => {
    try {
        const doc = await db.collection('usuarios').doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).json({ 
                erro: 'Usuário não encontrado' 
            });
        }

        res.json({ 
            usuario: {
                id: doc.id,
                ...doc.data()
            }
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ erro: 'Erro ao buscar usuário' });
    }
};

// Atualizar usuário
const atualizarUsuario = async (req, res) => {
    try {
        const { username, email, senha, permissoes } = req.body;
        const usuarioRef = db.collection('usuarios').doc(req.params.id);

        const doc = await usuarioRef.get();
        if (!doc.exists) {
            return res.status(404).json({ 
                erro: 'Usuário não encontrado' 
            });
        }

        // Preparar dados para atualização
        const atualizacoes = {};
        if (username) atualizacoes.username = username;
        if (email) atualizacoes.email = email;
        if (senha) atualizacoes.senha = senha;
        if (permissoes) atualizacoes.permissoes = permissoes;
        atualizacoes.atualizadoEm = new Date();

        await usuarioRef.update(atualizacoes);

        const usuarioAtualizado = await usuarioRef.get();
        res.json({ 
            mensagem: 'Usuário atualizado com sucesso', 
            usuario: {
                id: usuarioAtualizado.id,
                ...usuarioAtualizado.data()
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ erro: 'Erro ao atualizar usuário' });
    }
};

// Deletar usuário
const deletarUsuario = async (req, res) => {
    try {
        const usuarioRef = db.collection('usuarios').doc(req.params.id);
        const doc = await usuarioRef.get();

        if (!doc.exists) {
            return res.status(404).json({ 
                erro: 'Usuário não encontrado' 
            });
        }

        await usuarioRef.delete();

        res.json({ 
            mensagem: 'Usuário deletado com sucesso',
            usuario: {
                id: doc.id,
                ...doc.data()
            }
        });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ erro: 'Erro ao deletar usuário' });
    }
};

module.exports = {
    listarUsuarios,
    criarUsuario,
    listarUsuarioPorId,
    atualizarUsuario,
    deletarUsuario
};