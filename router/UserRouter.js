const router = require('express').Router()
const userController = require('../controller/UserController')
const { checkToken } = require('../middleware/')
router.get('/', userController.getAllUser)
router.post('/register', userController.registerUser)
router.get('/:id', userController.getUserById)
router.put('/username/:id', userController.updateUserName)
router.put('/password/:id', userController.updatePassword)
router.post('/login', userController.loginUser)
router.delete('/delete/:id', checkToken, userController.deleteUser)

module.exports = router