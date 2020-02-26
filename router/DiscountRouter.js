const router = require('express').Router()
const discountController = require('../controller/DiscountController')

router.post('/', discountController.createDiscount)

module.exports = router