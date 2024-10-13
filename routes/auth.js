import express from 'express';
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '12345') {
        req.session.user = username;
        res.redirect('/partidos');
    } else {
        res.render('login', { error: 'Usuário ou senha incorretos' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao tentar sair.');
        }
        res.redirect('/auth/login');
    });
});


export default router; 
