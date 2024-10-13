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
    connection.query('SELECT * FROM partidos', (err, resultados) => {
        if (err) return res.status(500).send(err);
        res.render('partidos', { partidos: resultados });
    });
});

router.post('/', requireLogin, (req, res) => {
    const { nome, sigla, numero } = req.body;

    if (!nome || !sigla || !numero) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    connection.query('INSERT INTO partidos (nome, sigla, numero) VALUES (?, ?, ?)', [nome, sigla, numero], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/partidos');
    });
});

router.get('/editar/:id', requireLogin, (req, res) => {
    const id = req.params.id;
    console.log("ID do partido:", id); 
    connection.query('SELECT * FROM partidos WHERE id = ?', [id], (err, resultados) => {
        if (err) return res.status(500).send(err);
        
        const partido = resultados[0];
        if (!partido) {
            return res.status(404).send('Partido não encontrado.');
        }
        
        res.render('editarPartido', { partido });
    });
});

router.post('/editar/:id',  requireLogin, (req, res) => {
    const id = req.params.id;
    const { nome, sigla, numero } = req.body;

    if (!nome || !sigla || !numero) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    connection.query('UPDATE partidos SET nome = ?, sigla = ?, numero = ? WHERE id = ?', [nome, sigla, numero, id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/partidos');
    });
});

router.post('/excluir/:id', requireLogin, (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM partidos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/partidos');
    });
});

export default router;
