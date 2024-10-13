import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    port: 3306,
    password: '',
    database: 'sistema_partidos',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conectado ao banco de dados como ID ' + connection.threadId);
});

export default connection; 
