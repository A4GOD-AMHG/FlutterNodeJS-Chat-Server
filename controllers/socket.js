const User = require('../models/user');

const setOnline = async (uid, online) => {
    try {
        return await User.findByIdAndUpdate(uid, {online}, {new: true});
    } catch (error) {
        console.error(error);
        return null;
    }
}

const connectedUser = (uid = '') => setOnline(uid, true);

const disconnectedUser = (uid = '') => setOnline(uid, false);

module.exports = {
    connectedUser,
    disconnectedUser
}
