const router = require('express').Router()
const userController = require('../controller/UserController')

router.get('/', userController.getAllUser)
router.post('/register', userController.registerUser)
router.get('/:id', userController.getUserById)
router.put('/username/:id', userController.updateUserName)
router.put('/password/:id', userController.updatePassword)
router.post('/login', userController.loginUser)
router.delete('/delete/:id', userController.deleteUser)
router.post('/admin', userController.admin)

module.exports = router