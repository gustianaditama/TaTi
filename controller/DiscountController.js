const db = require('../database')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const diskStorage = multer.diskStorage({
    destination: "./image",
    filename: function(req, file, callback){
        callback(null, file.fieldname + "_" +file.originalname)
    }
})
const upload = multer({storage : diskStorage})

const createDiscount = async (req, res, next)=>{
    const username = req.body.username
    const password = req.body.username
    const [rows] = await db.query('select * from admin where name = ?', [username])
    if(rows.length != 0){
        const admin = rows[0]
        const isVerified = await bcrypt.compare(password, admin.password)
        if(isVerified){
            if(req.file){
                var filename = req.file.filename
                var status = "upload success"
            }else{
                var filename = "NO FILE FOUND"
                var status = "upload failed"
            }
            const name = req.body.name
            const type = req.body.type
            const image = "image/" + filename
            if(type == 0){
                const percentage = req.body.percentage
                const max = req.body.max
                if(percentage >= 0 && percentage <= 0){
                    db.query('insert into discount(name, type, percentage, max, image) values(?, ?, ?, ?, ?)', [name, type, percentage, max, image])
                    .then(()=>{
                        res.json({
                            "success" : true,
                            "message" : "discount created"
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
                    res.status(403)
                    const error = new Error("percentage cannot exceed 100")
                    next(error)
                }
            }else if(type == 1){
                const value = req.body.value
                db.query('insert into discount(name, type, value, image) values(?, ?, ?, ?)', [name, type, value, image])
                .then(()=>{
                    res.json({
                        "success" : true,
                        "message" : "discount created"
                    })
                })
                .catch((err)=>{
                    res.status(500)
                    res.json({
                        "success" : true,
                        "error" : err
                    })
                })
            }else{
                res.json(403)
                const error = new Error("type Undefined")
                next(error)
            }
        }else{
            res.json(403)
            const error = new Error("Wrong password")
            next(error)
        }
    }else{
        res.status(409)
        const error = new Error("not an admin")
        next(error)
    }
}

const discountController = {
    createDiscount
}

module.exports = discountController

