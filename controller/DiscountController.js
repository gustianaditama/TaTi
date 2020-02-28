const db = require('../database')

const createDiscount = async (req, res, next)=>{
    const role = req.user.role
    if(role == 1){
        const name = req.body.name
        const type = req.body.type
        let query
        let params = []
        let status = true
        let message = "discount created"
        if(type == 0){
            const percentage = req.body.percentage
            if(percentage >= 0 && percentage <= 100){
                const max = req.body.max
                query = 'insert into discount(name, type, percentage, max) values(?, ?, ?, ?)'
                params = [name, type, percentage, max]
            }else{
                status = false
                message = "Percentage can only between 0 to 100"
            }
        }else if(type == 1){
            const value = req.body.value
            query = 'insert into discount(name, type, value) values(?, ?, ?)'
            params = [name, type, value]

        }else{
            status = false
            message = "Type undefined"
        }
        db.query(query, params)
        .then(()=>{
            res.json({
                "success" : status,
                "message" : message
            })
        })
        .catch((err)=>{
            res.status(500)
            res.json({
                "success" : false,
                "error" : err
            })
        })
    }else{
        res.status(409)
        res.json({
            "success" : false,
            "erorr" : "You are not admin"
        })
    }
}

const discountController = {
    createDiscount
}

module.exports = discountController

