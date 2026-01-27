const admin = require('firebase-admin');
const path = require('path');

// Importar as credenciais do Firebase
const serviceAccount = require('./serviceAccountKey.json');

// Inicializar Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://seu-projeto.firebaseio.com'
});

// Obter referência do Firestore
const db = admin.firestore();

console.log('✅ Firebase inicializado com sucesso!');

module.exports = db;