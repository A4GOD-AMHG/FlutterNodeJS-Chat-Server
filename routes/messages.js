/*
    Path: /api/messages
*/

const {Router} = require('express');
const { check } = require('express-validator');
const { getChat, deleteMessage, editMessage, sendMessage } = require('../controllers/messages');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.use(validateJWT);

router.post('/', [
    check('to', 'El destinatario no es válido').isMongoId(),
    check('message', 'El mensaje es obligatorio').trim().not().isEmpty(),
    validateFields
], sendMessage);
router.get('/', [
    check('from', 'El usuario no es válido').isMongoId(),
    validateFields
], getChat);
router.delete('/delete/:id', [
    check('id', 'El id no es válido').isMongoId(),
    validateFields
], deleteMessage);
router.put('/edit', [
    check('_id', 'El id no es válido').isMongoId(),
    check('message', 'El mensaje es obligatorio').trim().not().isEmpty(),
    validateFields
], editMessage);

module.exports = router;
