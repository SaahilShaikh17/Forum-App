const express = require('express');
router = express.Router();
const authController = require('../controllers/authenticationController');

router.post('/', authController.handleLogin);

module.exports = router;