const { checkJWT } = require('../helpers/jwt');
const { io } = require('../index');
const {connectedUser, disconnectedUser} = require('../controllers/socket');


// Mensajes de Sockets
io.on('connection', client => {
    const [valid, uid] = checkJWT(client.handshake.headers['x-token']);

    // Verificar autenticación
    if (!valid) return client.disconnect();

    console.log('Cliente conectado', uid);

    //Cliente autenticado
    connectedUser(uid);

    // Ingresar al usuario en una sala con su uid
    client.join(uid);

    // Se reenvía al destinatario; el remitente se toma del token, no del payload
    client.on('personal-message', (payload = {}) => {
        if (!payload.to) return;
        io.to(payload.to).emit('personal-message', {...payload, from: uid});
    });

    client.on('delete-message', (payload = {}) => {
        if (!payload.to) return;
        io.to(payload.to).emit('delete-message', payload.id);
    });

    client.on('edit-message', (payload = {}) => {
        if (!payload.to) return;
        io.to(payload.to).emit('edit-message', {...payload, from: uid});
    });

    client.on('disconnect', () => {
        disconnectedUser(uid);
    });
});
