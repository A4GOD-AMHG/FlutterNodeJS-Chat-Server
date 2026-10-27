const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.LOCAL_DB || process.env.DB_CNN);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error(error);
        throw new Error('Error en la base de datos - Hable con el admin');
    }
}

module.exports = {
    dbConnection
}
