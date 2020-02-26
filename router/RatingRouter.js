const router = require('express').Router()
const ratingController = require('../controller/RatingController')

router.get('/:id', ratingController.getRatingById)
router.get('/post/postRating/:id_post', ratingController.getPostRating)
router.post('/:id_post', ratingController.ratePost)
router.put('/:id_post', ratingController.changeRating)
router.put('/post/postRating/:id_post', ratingController.totalPostRating)
router.delete('/:id_post', ratingController.deleteRating)

module.exports = router