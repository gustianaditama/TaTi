const router = require('express').Router()
const transactionController = require('../controller/TransactionController')
const { checkToken } = require('../middleware/')

router.post('/topUp', checkToken, transactionController.topUp)
router.put('/:id_post', checkToken, transactionController.buy)
router.post('/code', checkToken, transactionController.createCode)
router.delete('/code/:id_code', checkToken, transactionController.deleteCode)
router.put('/cancel/:id_history', checkToken, transactionController.cancel)

module.exports = router