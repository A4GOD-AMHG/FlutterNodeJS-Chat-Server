const { response } = require("express");
const User = require('../models/user');

const getUsers = async (req, res = response) => {

    const since = Number(req.query.since) || 0;

    try {
        const users = await User
        .find({_id: {$ne: req.uid}})
        .sort('-online')
        .skip(since)
        .limit(20);

        return res.json({
            ok: true,
            users,
            since
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {getUsers}
