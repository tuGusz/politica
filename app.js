import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import partidoRoutes from './routes/partidos.js';
import candidatoRoutes from './routes/candidatos.js';

const app = express();
app.locals.partidos = []; 

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 } 
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.use('/auth', authRoutes);
app.use('/partidos', partidoRoutes);
app.use('/candidatos', candidatoRoutes);
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
