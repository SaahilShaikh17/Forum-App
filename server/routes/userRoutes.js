//userRoutes.js
const express = require('express');
const router = require('express').Router();
const UserController = require('../controllers/userController');

router.route('/')
    .get(UserController.getAllUsers)
    

    router.route('/:userId')
    .get(UserController.getUserById)
    .put(UserController.updateUser)
    .delete(UserController.deleteUser).get()

module.exports = router;