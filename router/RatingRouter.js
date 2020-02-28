const router = require('express').Router()
const ratingController = require('../controller/RatingController')

router.get('/postRating/:id_post', ratingController.getPostRating)
router.post('/:id_post', ratingController.ratePost)
router.put('/:id_post', ratingController.changeRating)
router.put('/postRating/:id_post', ratingController.totalPostRating)
router.delete('/:id_post', ratingController.deleteRating)

module.exports = router