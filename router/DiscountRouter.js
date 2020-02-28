const router = require('express').Router()
const discountController = require('../controller/DiscountController')
const { checkToken } = require('../middleware/')

router.post('/', checkToken, discountController.createDiscount)

module.exports = router