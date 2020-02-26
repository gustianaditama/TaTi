const db = require('../database')
const multer = require('multer')
const diskStorage = multer.diskStorage({
    destination: "./image",
    filename: function(req, file, callback){
        callback(null, file.fieldname + "_" +file.originalname)
    }
})
const upload = multer({storage : diskStorage})

const getPostById = async(req, res, next)=>{
    const id_post = req.params.id_post
    const [rows] = await db.query('select * from post where id = ?', [id_post])
    if (rows.length != 0){
        res.json({
            "success" : true,
            "user" : rows[0]
        })
    }else{
        res.status(404)
        res.json({
            "success" : false,
            "message" : "post not found"
        })
    }
}

const postPost = (req, res, next)=>{
    if(req.file){
        var filename = req.file.filename
        var status = "upload success"
    }else{
        var filename = "NO FILE FOUND"
        var status = "upload failed"
    }
    const id_user = req.user.id_user
    const itemName = req.body.itemName
    const description = req.body.description
    const readyAt = req.body.readyAt
    const stock = req.body.stock
    const image = "image/" + filename
    const price = req.body.price
    db.query('insert into post(id_user, itemName, description, readyAt, stock, price, image) values(?, ?, ?, ?, ?, ?, ?)', [id_user, itemName, description, readyAt, stock, price, image])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "post created",
                status : status,
                filename : `Name Of File: ${filename}`
            })
        })
        .catch((err)=>{
            res.json({
                "success" : false,
                "error" : err
            })
        })
}

const updateStock = (req, res, next)=>{
    const id_post = req.params.id_post
    const stock = req.body.stock
    db.query('update post set stock = ? where id = ?', [stock, id_post])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "stock updated"
            })
        })
        .catch((err)=>{
            res.json({
                "success" : false,
                "error" : err
            })
        })


}

const updatePrice = (req, res, next)=>{
    const id_post = req.params.id_post
    const price = req.body.price
    db.query('update post set price = ? where id = ?', [price, id_post])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "price updated"
            })
        })
        .catch((err)=>{
            res.json({
                "success" : false,
                "error" : err
            })
        })
}

const updateReadyAt = (req, res, next)=>{
    const id_post = req.params.id_post
    const price = req.body.readyAt
    db.query('update post set readyAt = ? where id = ?', [readyAt, id_post])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "ready time updated"
            })
        })
        .catch(()=>{
            res.json({
                "success" : false,
                "error" : err
            })
        })
}

const deletePost = (req, res, next)=>{
    const id_post = req.params.id_post
    db.query('delete from post where id = ?', [id_post])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "post deleted"
            })
        })
        .catch((err)=>{
            res.json({
                "success" : false,
                "error" : err
            })
        })
}

const applyDiscount = async (req, res, next)=>{
    const id_discount = req.params.id_discount
    const id_post = req.params.id_post
    const [rows] = await db.query('select * from discount where id = ?', [id_discount])
    const [rows1] = await db.query('select * from post where id = ?', [id_post])
    const discount = rows[0]
    const post = rows1[0]
    if(discount.type == 0){
        if(discountValue > discount.max){
            var discountValue = discount.max
        }else{
            var discountValue = discount.percentage/100 * post.price
        }
    }else{
        var discountValue = discount.value
    }
    const priceUpdated = post.price - discountValue
    db.query('update post set priceDiscounted = ?, discountValue = ?, discountName = ? where id = ?', [priceUpdated, discountValue, discount.name, id_post])
    .then(()=>{
        res.json({
            "success" : true,
            "message" : "Discount apllied"
        })
    })
    .catch((err)=>{
        next(err)
    })
}

const postController = {
    upload,
    getPostById,
    postPost,
    updateStock,
    updatePrice,
    deletePost,
    updateReadyAt,
    applyDiscount
}

module.exports = postController