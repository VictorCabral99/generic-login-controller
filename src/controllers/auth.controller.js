const express = require('express');
const router = express.Router();

// Importar o array de usuários do user controller
const { usuarios } = require('./user.controller');

// Simulando sessões
let usuariosAutenticados = {};

const login = (req, res) => {
    const { email, senha } = req.body;

    // Validação 1: Verificar se email e senha foram enviados
    if (!email || !senha) {
        return res.status(400).json({ 
            erro: 'Email e senha são obrigatórios' 
        });
    }

    // Validação 2: Buscar o usuário no array de usuários
    const usuarioEncontrado = usuarios.find(u => u.email === email);

    // Validação 3: Verificar se o usuário existe
    if (!usuarioEncontrado) {
        return res.status(401).json({ 
            erro: 'Email ou senha incorretos' 
        });
    }

    // Validação 4: Verificar se a senha está correta
    if (usuarioEncontrado.senha !== senha) {
        return res.status(401).json({ 
            erro: 'Email ou senha incorretos' 
        });
    }

    // Sucesso: Criar sessão/token
    const sessionId = `session_${Date.now()}`;
    usuariosAutenticados[sessionId] = {
        id: usuarioEncontrado.id,
        email: usuarioEncontrado.email,
        username: usuarioEncontrado.username,
        timestamp: Date.now()
    };

    // Retornar dados do usuário autenticado (SEM a senha!)
    res.status(200).json({ 
        mensagem: 'Login realizado com sucesso',
        sessionId,
        usuario: {
            id: usuarioEncontrado.id,
            username: usuarioEncontrado.username,
            email: usuarioEncontrado.email,
            permissoes: usuarioEncontrado.permissoes
        }
    });
};

const logout = (req, res) => {
    const { sessionId } = req.body;

    // Validar se sessão foi enviada
    if (!sessionId) {
        return res.status(400).json({ 
            erro: 'SessionId é obrigatório' 
        });
    }

    // Verificar se sessão existe
    if (!usuariosAutenticados[sessionId]) {
        return res.status(401).json({ 
            erro: 'Sessão inválida ou expirada' 
        });
    }

    // Deletar sessão
    delete usuariosAutenticados[sessionId];

    res.status(200).json({ 
        mensagem: 'Logout realizado com sucesso' 
    });
};

const forgotPassword = (req, res) => {
    const { email } = req.body;

    // Validar se email foi enviado
    if (!email) {
        return res.status(400).json({ 
            erro: 'Email é obrigatório' 
        });
    }

    // Em produção: Verificar se email existe no banco
    // Depois enviar email com link de reset
    res.status(200).json({ 
        mensagem: 'Email de recuperação de senha enviado com sucesso',
        info: 'Verifique sua caixa de entrada (implementar envio real de email depois)'
    });
};

module.exports = {
    login,
    logout,
    forgotPassword
};