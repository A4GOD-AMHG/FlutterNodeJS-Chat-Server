const { response } = require('express');
const Message = require('../models/message');

const serverError = (res, error) => {
    console.error(error);
    return res.status(500).json({
        ok: false,
        msg: 'Hable con el administrador'
    });
}

// El remitente siempre es el usuario del token, nunca el que manda el cliente
const sendMessage = async (req, res = response) => {
    try {
        const message = new Message({
            from: req.uid,
            to: req.body.to,
            message: req.body.message
        });
        await message.save();

        // toJSON del modelo devuelve { uid, from, to, message, createdAt, updatedAt }
        res.json(message);
    } catch (error) {
        serverError(res, error);
    }
}

const getChat = async (req, res = response) => {
    const myId = req.uid;
    const messagesFrom = req.query.from;
    const limit = Math.min(Number(req.query.limit) || 30, 100);

    try {
        const messages = await Message.find({
            $or: [{from: myId, to: messagesFrom}, {from: messagesFrom, to: myId}]
        })
        .sort({createdAt: 'desc'})
        .limit(limit);

        res.json({
            ok: true,
            myId,
            messages
        });
    } catch (error) {
        serverError(res, error);
    }
}

const deleteMessage = async (req, res = response) => {
    try {
        const deleteMessage = await Message.findOneAndDelete({
            _id: req.params.id,
            from: req.uid
        });

        if(!deleteMessage){
            return res.status(404).json({
                ok: false,
                msg: 'Mensaje no encontrado'
            });
        }

        res.json({
            ok: true,
            deleteMessage
        });
    } catch (error) {
        serverError(res, error);
    }
}

const editMessage = async (req, res = response) => {
    try {
        // Solo se puede cambiar el texto de un mensaje propio
        const message = await Message.findOneAndUpdate(
            {_id: req.body._id, from: req.uid},
            {message: req.body.message},
            {new: true}
        );

        if(!message){
            return res.status(404).json({
                ok: false,
                msg: 'Mensaje no encontrado'
            });
        }

        res.json({
            ok: true,
            message
        });
    } catch (error) {
        serverError(res, error);
    }
}

module.exports = {getChat, deleteMessage, editMessage, sendMessage}
