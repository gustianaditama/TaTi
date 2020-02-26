const router = require('express').Router()
const postController = require('../controller/PostController')
const { checkToken } = require('../middleware/')

router.get('/:id_post', postController.getPostById)
router.post('/', checkToken, postController.upload.single('image'), postController.postPost)
router.put('/stock/:id_post', postController.updateStock)
router.put('/price/:id_post', postController.updatePrice)
router.put('/readyat/:id_post', postController.updateReadyAt)
router.delete('/delete/:id_post', checkToken, postController.deletePost)
router.put('/discount/:id_post/:id_discount', postController.applyDiscount)

module.exports = router


