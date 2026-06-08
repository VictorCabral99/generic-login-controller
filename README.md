# Generic Login Controller

Módulo de autenticação e autorização **reutilizável** para aplicações Node.js. Serve como ponto de partida para projetos que precisam de login, gestão de usuários e controle de permissões prontos para usar.

## Funcionalidades

- Login e logout
- Recuperação e redefinição de senha (`forgot-password` / `reset-password`)
- CRUD de usuários
- CRUD de permissões (controle de acesso baseado em papéis)
- Dashboard administrativo
- Páginas renderizadas no servidor com EJS

## Stack

- **Node.js** + **Express 5**
- **EJS** (views server-side)
- **Firebase Admin** (autenticação e dados)
- **Nodemailer** (e-mails de recuperação de senha)

## Pré-requisitos

- Node.js 18+
- Projeto no Firebase com credenciais de serviço

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com as credenciais do Firebase e do servidor de e-mail:

```env
# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# E-mail (Nodemailer)
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
```

> Ajuste os nomes das variáveis conforme o `firebase-config.js` do projeto.

## Como rodar

```bash
# Desenvolvimento (com reload via nodemon)
npm run dev

# Produção
npm start
```

## Estrutura

```
src
├── controllers   # auth, user, permission
├── routes        # rotas de API e de views
└── views         # páginas EJS (login, dashboard, usuários, permissões)
public            # assets e scripts do cliente
```

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE).
