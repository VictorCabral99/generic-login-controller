const express = require('express');
const nodemailer = require('nodemailer');

// Importar db e usuários do user controller
const db = require('../../firebase-config');

// Simulando sessões
let usuariosAutenticados = {};

// Configuração do Nodemailer (Gmail com suporte TLS)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS, não SSL
    auth: {
        user: process.env.EMAIL_USER || 'seu_email@gmail.com',
        pass: process.env.EMAIL_PASS || 'sua_senha_de_app'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Testar conexão ao iniciar
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Erro na conexão com Gmail:', error);
    } else {
        console.log('✅ Conexão com Gmail estabelecida com sucesso!');
    }
});

// Função para gerar token aleatório
function gerarToken() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validação 1: Verificar se email e senha foram enviados
        if (!email || !senha) {
            return res.status(400).json({ 
                erro: 'Email e senha são obrigatórios' 
            });
        }

        // Validação 2: Buscar o usuário no Firebase
        const usuariosSnapshot = await db.collection('usuarios')
            .where('email', '==', email)
            .get();

        // Validação 3: Verificar se o usuário existe
        if (usuariosSnapshot.empty) {
            return res.status(401).json({ 
                erro: 'Email ou senha incorretos' 
            });
        }

        const usuarioDoc = usuariosSnapshot.docs[0];
        const usuarioEncontrado = usuarioDoc.data();

        // Validação 4: Verificar se a senha está correta
        if (usuarioEncontrado.senha !== senha) {
            return res.status(401).json({ 
                erro: 'Email ou senha incorretos' 
            });
        }

        // Sucesso: Criar sessão/token
        const sessionId = `session_${Date.now()}`;
        usuariosAutenticados[sessionId] = {
            id: usuarioDoc.id,
            email: usuarioEncontrado.email,
            username: usuarioEncontrado.username,
            timestamp: Date.now()
        };

        // Retornar dados do usuário autenticado (SEM a senha!)
        res.status(200).json({ 
            mensagem: 'Login realizado com sucesso',
            sessionId,
            usuario: {
                id: usuarioDoc.id,
                username: usuarioEncontrado.username,
                email: usuarioEncontrado.email,
                permissoes: usuarioEncontrado.permissoes
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ erro: 'Erro ao fazer login' });
    }
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

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    console.log('📨 Solicitação de reset recebida para:', email);

    try {
        // Validação 1: Verificar se email foi enviado
        if (!email) {
            return res.status(400).json({ 
                erro: 'Email é obrigatório' 
            });
        }

        // Validação 2: Verificar se email existe no Firebase
        const usuariosSnapshot = await db.collection('usuarios')
            .where('email', '==', email)
            .get();

        if (usuariosSnapshot.empty) {
            console.log('❌ Usuário não encontrado:', email);
            return res.status(404).json({ 
                erro: 'Usuário não encontrado com este email' 
            });
        }

        const usuarioDoc = usuariosSnapshot.docs[0];
        const usuarioEncontrado = usuarioDoc.data();

        // Gerar token único
        const token = gerarToken();
        
        // Armazenar token com informações de expiração (1 hora = 3600000 ms)
        const tempoExpiracao = Date.now() + (60 * 60 * 1000); // 1 hora
        
        // Armazenar token no Firebase
        await db.collection('tokensReset').doc(token).set({
            email: email,
            usuarioId: usuarioDoc.id,
            expiresAt: tempoExpiracao
        });

        // Link para reset de senha
        const linkReset = `http://localhost:3000/reset-password?token=${token}`;

        console.log('🔑 Token gerado:', token);
        console.log('🔗 Link de reset:', linkReset);

        // Enviar email real
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset de Senha - Generic Login Controller',
            html: `
                <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="background-color: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333; margin-bottom: 20px;">Reset de Senha</h2>
                        
                        <p style="color: #666; line-height: 1.6;">
                            Olá ${usuarioEncontrado.username},
                        </p>
                        
                        <p style="color: #666; line-height: 1.6;">
                            Você solicitou um reset de senha. Clique no botão abaixo para criar uma nova senha:
                        </p>
                        
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${linkReset}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Resetar Senha
                            </a>
                        </div>
                        
                        <p style="color: #999; font-size: 12px; line-height: 1.6;">
                            Ou copie e cole este link no seu navegador: <br/>
                            ${linkReset}
                        </p>
                        
                        <p style="color: #999; font-size: 12px; line-height: 1.6;">
                            Este link expira em 1 hora por razões de segurança.
                        </p>
                        
                        <p style="color: #999; font-size: 12px; line-height: 1.6; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                            Se você não solicitou este reset, ignore este email.
                        </p>
                    </div>
                </div>
            `
        };

        console.log('📤 Enviando email de:', process.env.EMAIL_USER, 'para:', email);

        await transporter.sendMail(mailOptions);

        console.log('✅ Email enviado com sucesso para:', email);

        res.status(200).json({ 
            mensagem: 'Email de recuperação de senha enviado com sucesso',
            info: 'Verifique sua caixa de entrada e pasta de SPAM'
        });
    } catch (error) {
        console.error('❌ Erro ao enviar email:', error);
        console.error('Stack:', error.stack);
        
        res.status(500).json({ 
            erro: 'Erro ao enviar email: ' + error.message,
            detalhes: 'Verifique as credenciais do Gmail no arquivo .env'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, novaSenha } = req.body;

        // Validação 1: Verificar se token e nova senha foram enviados
        if (!token || !novaSenha) {
            return res.status(400).json({ 
                erro: 'Token e nova senha são obrigatórios' 
            });
        }

        // Validação 2: Buscar token no Firebase
        const tokenDoc = await db.collection('tokensReset').doc(token).get();

        if (!tokenDoc.exists) {
            return res.status(400).json({ 
                erro: 'Token inválido ou expirado' 
            });
        }

        const tokenData = tokenDoc.data();

        // Validação 3: Verificar se token expirou
        if (Date.now() > tokenData.expiresAt) {
            await db.collection('tokensReset').doc(token).delete();
            return res.status(400).json({ 
                erro: 'Token expirado! Solicite um novo reset de senha' 
            });
        }

        // Validação 4: Encontrar e atualizar o usuário
        await db.collection('usuarios')
            .doc(tokenData.usuarioId)
            .update({ senha: novaSenha });

        // Deletar o token após o uso (consumido)
        await db.collection('tokensReset').doc(token).delete();

        res.status(200).json({ 
            mensagem: 'Senha resetada com sucesso!',
            info: 'Você pode fazer login com sua nova senha'
        });
    } catch (error) {
        console.error('Erro ao resetar senha:', error);
        res.status(500).json({ erro: 'Erro ao resetar senha' });
    }
};

module.exports = {
    login,
    logout,
    forgotPassword,
    resetPassword
};