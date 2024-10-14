const express = require('express');
router = express.Router();
const registerController = require('../controllers/createUser');

router.post('/', registerController.handleNewUser);

module.exports = router;