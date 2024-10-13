import express from 'express';
import connection from '../db.js';  

const router = express.Router();

const requireLogin = (req, res, next) => {
    if (!req.session.user) {  
        return res.status(403).send('Você precisa estar logado para acessar esta página.');
    }
    next();
};

router.get('/', requireLogin, (req, res) => {
    connection.query('SELECT * FROM candidatos', (errCandidatos, resultadosCandidatos) => {
        if (errCandidatos) return res.status(500).send(errCandidatos);

        connection.query('SELECT * FROM partidos', (errPartidos, resultadosPartidos) => {
            if (errPartidos) return res.status(500).send(errPartidos);

            res.render('candidatos', { candidatos: resultadosCandidatos, partidos: resultadosPartidos }); 
        });
    });
});

router.post('/', requireLogin, (req, res) => {
    const { nome, partido, numero } = req.body;

    if (!nome || !partido || !numero) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

  
    connection.query('SELECT id FROM partidos WHERE nome = ?', [partido], (err, resultados) => {
        if (err) return res.status(500).send(err);

        const partido_id = resultados[0]?.id; 
        if (!partido_id) return res.status(400).send('Partido não encontrado.');

      
        connection.query('INSERT INTO candidatos (nome, partido_id, numero) VALUES (?, ?, ?)', [nome, partido_id, numero], (err) => {
            if (err) return res.status(500).send(err);
            res.redirect('/candidatos');
        });
    });
});

router.get('/editar/:id', requireLogin, (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM candidatos WHERE id = ?', [id], (err, resultados) => {
        if (err) return res.status(500).send(err);
        
        const candidato = resultados[0];
        if (!candidato) {
            return res.status(404).send('Candidato não encontrado.');
        }

     
        connection.query('SELECT * FROM partidos', (err, partidos) => {
            if (err) return res.status(500).send(err);
            res.render('editarCandidato', { candidato, partidos });
        });
    });
});

router.post('/editar/:id', requireLogin, (req, res) => {
    const id = req.params.id;
    const { nome, partido, numero } = req.body;

    if (!nome || !partido || !numero) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const partido_id = partido; 
    if (!partido_id) return res.status(400).send('Partido não encontrado.');
    connection.query('UPDATE candidatos SET nome = ?, partido_id = ?, numero = ? WHERE id = ?', [nome, partido_id, numero, id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/candidatos');
    });
});

router.post('/excluir/:id',  requireLogin, (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM candidatos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/candidatos');
    });
});

router.get('/logout', requireLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao tentar sair.');
        }
        res.redirect('/');  
    });
});


export default router;
