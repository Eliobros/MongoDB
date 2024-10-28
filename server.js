// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB URI
const uri = `mongodb+srv://eliobrostech3:${process.env.DB_PASSWORD}@tina.0jwcr.mongodb.net/?retryWrites=true&w=majority&appName=Tina`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Função para conectar ao MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("Conectado ao MongoDB!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
    }
}

// Chamar a função de conexão
connectDB();

// Rota de registro
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const database = client.db('tina'); // Substitua 'tina' pelo seu nome de banco de dados
        const users = database.collection('users'); // Substitua 'users' pelo nome da sua coleção

        const newUser = { username, email, password };
        await users.insertOne(newUser);

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
        res.status(400).json({ error: 'Erro ao registrar usuário: ' + err.message });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const database = client.db('tina'); // Substitua 'tina' pelo seu nome de banco de dados
        const users = database.collection('users'); // Substitua 'users' pelo nome da sua coleção

        const user = await users.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        res.status(200).json({ message: 'Login bem-sucedido!' });
    } catch (err) {
        res.status(400).json({ error: 'Erro ao fazer login: ' + err.message });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
