

// backend/server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();  // Carregar variáveis do .env
const app = express();
const path = require('path');

// Serve arquivos estáticos diretamente da raiz do projeto
app.use(express.static(path.join(__dirname)));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);



// Configuração do banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  


// Conectar ao banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro de conexão no MySQL:', err);
    } else {
        console.log('Conectado ao MySQL!');
    }
});

// Middlewares
// Permitir todas as origens (no caso de desenvolvimento, você pode especificar um domínio)
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Permite requisições somente do seu frontend local
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Os métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rotas

// Buscar todos os horários
app.get('/horarios', (req, res) => {
    db.query('SELECT * FROM horarios', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao buscar horários' });
        } else {
            res.json(results);
        }
    });
});

// Adicionar novo horário
app.post('/horarios', (req, res) => {
    const { data, hora } = req.body;
    if (!data || !hora) {
        return res.status(400).json({ error: 'Data e hora são obrigatórias.' });
    }
    db.query('INSERT INTO horarios (data, hora) VALUES (?, ?)', [data, hora], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao adicionar horário' });
        } else {
            res.json({ message: 'Horário adicionado com sucesso!' });
        }
    });
});

// Buscar usuário pelo CPF
app.get('/usuario/:cpf', (req, res) => {
    const { cpf } = req.params;
    
    db.query('SELECT * FROM usuarios WHERE cpf = ?', [cpf], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao buscar usuário' });
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        }
    });
});

// Cadastrar novo usuário
app.post('/usuario/cadastrar', (req, res) => {
    const { nome, cpf, senha, numero_celular } = req.body;

    if (!nome || !cpf || !senha || !numero_celular) {
        return res.status(400).json({ message: 'Nome, CPF e senha são obrigatórios.' });
    }

    db.query('SELECT * FROM usuarios WHERE cpf = ?', [cpf], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao verificar CPF.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Usuário com esse CPF já cadastrado.' });
        }

        db.query('INSERT INTO usuarios (nome, cpf, senha, numero_celular, tipo) VALUES (?, ?, ?, ?, ?)', 
    [nome, cpf, senha, numero_celular, 'cliente'], 
    (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
        }
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
            }
        );
    });
});

// Agendar horário
app.post('/agendar', (req, res) => {
    const { usuario_cpf, horario_id } = req.body;

    if (!usuario_cpf || !horario_id) {
        return res.status(400).json({ message: 'CPF do usuário e ID do horário são obrigatórios.' });
    }

    db.query('SELECT * FROM agendamentos WHERE usuario_cpf = ? AND horario_id = ?', [usuario_cpf, horario_id], (err, agendamentos) => {
        if (err) {
            console.error('Erro ao verificar agendamento:', err);
            return res.status(500).json({ message: 'Erro ao verificar agendamento' });
        }

        if (agendamentos.length > 0) {
            return res.status(400).json({ message: 'Você já tem um agendamento nesse horário.' });
        }

        db.query('INSERT INTO agendamentos (usuario_cpf, horario_id) VALUES (?, ?)', [usuario_cpf, horario_id], (err, result) => {
            if (err) {
                console.error('Erro ao agendar:', err);
                return res.status(500).json({ message: 'Erro ao realizar o agendamento' });
            }

            res.status(200).json({ message: 'Agendamento realizado com sucesso!' });
        });
    });
});

// Buscar todos os agendamentos com os dados dos clientes e horários
app.get('/agendamentos-com-clientes', (req, res) => {
    const query = `
        SELECT 
            agendamentos.id, 
            agendamentos.usuario_cpf, 
            agendamentos.horario_id, 
            usuarios.nome, 
            horarios.data, 
            horarios.hora
        FROM agendamentos
        JOIN usuarios ON agendamentos.usuario_cpf = usuarios.cpf
        JOIN horarios ON agendamentos.horario_id = horarios.id
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar agendamentos com clientes e horários:', err);
            return res.status(500).json({ message: 'Erro ao buscar agendamentos' });
        }
        res.json(results);
    });
});



// PUT /api/alterarHorario/:id
app.put('/agendamentos/:id/alterar-hora', (req, res) => {
    const id = req.params.id;
    const { novaData, novaHora } = req.body;

    // 1. Buscar o horario_id correspondente ao agendamento
    const buscaHorarioId = 'SELECT horario_id FROM agendamentos WHERE id = ?';

    db.query(buscaHorarioId, [id], (err, results) => {
        if (err || results.length === 0) {
            console.error('Erro ao buscar agendamento:', err);
            return res.status(500).json({ message: 'Erro ao buscar agendamento.' });
        }

        const horarioId = results[0].horario_id;

        // 2. Atualizar data e hora na tabela horarios
        const atualizaHorario = 'UPDATE horarios SET data = ?, hora = ? WHERE id = ?';
        db.query(atualizaHorario, [novaData, novaHora, horarioId], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar horário:', err);
                return res.status(500).json({ message: 'Erro ao atualizar o horário.' });
            }

            res.json({ message: 'Agendamento atualizado com sucesso!' });
        });
    });
});

  
  
  // Rota para cancelar agendamento
  app.delete('/agendamentos/:id', (req, res) => {
    const { id } = req.params;
  
    db.query('DELETE FROM agendamentos WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Erro ao cancelar agendamento:', err);
        return res.status(500).json({ message: 'Erro ao cancelar agendamento.' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Agendamento não encontrado.' });
      }
  
      res.json({ message: 'Agendamento cancelado com sucesso!' });
    });
  });
  

  app.get('/api/clientes', (req, res) => {
    db.query('SELECT nome, cpf, numero_celular FROM usuarios', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao buscar clientes' });
      } else {
        res.json(results);
      }
    });
  });
  
  app.get('/', (req, res) => {
    res.send('API do Microsaas está rodando com sucesso!');
  });

  