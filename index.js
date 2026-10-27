const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();


// App de Express
const app = express();


// Lectura y parseo del Body
app.use( express.json());

app.use(cors());

app.use(morgan('dev'));


// Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');


// Path público
const publicPath = path.resolve( __dirname, 'public' );
app.use( express.static( publicPath ) );


// Mis Rutas
app.use('/api/login', require('./routes/auth') );
app.use('/api/users', require('./routes/users') );
app.use('/api/messages', require('./routes/messages') );

// Respuestas JSON consistentes para rutas inexistentes y errores no controlados
app.use((req, res) => res.status(404).json({ ok: false, msg: 'Ruta no encontrada' }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ ok: false, msg: 'Hable con el administrador' });
});


// DB Config
const PORT = process.env.PORT || 3000;
require('./database/config').dbConnection()
    .then(() => server.listen(PORT, () => console.log('Servidor corriendo en puerto', PORT)))
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
