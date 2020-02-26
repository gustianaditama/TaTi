const router = require('express').Router()
const userRouter = require('./UserRouter')
const postRouter = require('./PostRouter')
const discountRouter = require('./DiscountRouter')
const ratingRouter = require('./RatingRouter')
const transactionRouter = require('./TransactionRouter')

router.get('/', (req, res)=>{
    res.send('project')
})

router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/rating', ratingRouter)
router.use('/discount', discountRouter)
router.use('/transaction', transactionRouter)
router.use(notFound)
router.use(errorHandler)

function notFound(req, res, next) {
    res.status(404)
    const err = new Error("Page not found")
    next(err)
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500)
    const message = err.message || "Internal server error"
    res.json({
        "message": message
    })
}

module.exports = router