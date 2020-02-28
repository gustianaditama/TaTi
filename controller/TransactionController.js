const db = require('../database')
const bcrypt = require('bcryptjs')
const randomstring = require('randomstring')

const createCode = (req, res, next)=>{
    const role = req.user.role
    if(role == 1){
        const createCode = randomstring.generate(12)
        db.query('insert into code(code) values(?)', [createCode])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "code created"
            })
        })
        .catch((err)=>{
            res.status(500)
            res.json({
                "success" : true,
                "erorr" : err
            })
        })
    }else{
        res.status(409)
        const error = new Error("not an admin")
        next(error)
    }
}

const topUp = async (req, res, next) =>{
    const id_user = req.user.id_user
    const [rows1] = await db.query('select * from user where id = ?', [id_user])
    const userBalance = rows1[0]
    const balance = req.body.balance
    const code = req.body.code
    const [rows] =  await db.query('select * from code where code = ?', [code])
    const a = rows[0]
    if(a){
        const totalBalance = balance + userBalance.balance
        await db.query('update user set balance = ? where id = ?', [totalBalance, id_user])
        .then(()=>{
            db.query('delete from code where code = ?', [code])
            res.json({
                "success" : true,
                "message" : "Top up success"
            })
        })
    }else{
        res.status(409)
        const error =  new Error("Wrong token")
        next(error)
    }
}

const buy = async (req, res, next)=>{
    let query1, query2
    const id_post = req.params.id_post
    const id_user = req.user.id_user
    query1 = 'select * from post where id = ?'
    query2 = 'select * from user where id = ?'
    const number = req.body.number
    const [rows1] = await db.query(query1, [id_post])
    const postData = rows1[0]
    const [rows2] = await db.query(query2, [id_user])
    const [rows3] = await db.query(query2, [postData.id_user])
    const buyerData = rows2[0]
    const sellerData = rows3[0]
    const totalPrice = postData.priceDiscounted * number
    if(postData.stock >= number){
        if(totalPrice <= buyerData.balance){
            const address = req.body.address
            const confirm = req.body.confirm
            const isVerified = await bcrypt.compare(confirm, buyerData.password)
            if(isVerified){
                query1 = 'update user set balance = ? where id = ?'
                query2 = 'update post set stock = ? where id = ?'
                await db.query(query1, [(totalPrice + sellerData.balance), sellerData.id],
                    query1, [(buyerData.balance - totalPrice), buyerData.id],
                    query2, [(postData.stock - number), id_post],
                    'insert into history (username_buyer, username_seller, totalPrice, address_buyer, itemName, number, id_post) values (?,?,?,?,?,?,?)', [buyerData.username, sellerData.username, totalPrice, address, postData.itemName, number, id_post])
                .then(()=>{
                    res.json({
                        "success" : true,
                        "message" : "Transaction success"
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
                const error = new Error("Wrong confirmation")
                next(error)
            }
        }else{
            res.status(403)
            const error = new Error("Insufficient balance")
            next(error)
        }
    }else{
        res.status(403)
        const error = new Error("Stock unavailable")
        next(error)
    }
}

const deleteCode = (req, res, next)=>{
    const id_code = req.params.id_code
    const role = req.user.role
    if(role == 1){
        db.query('delete from code where id = ?', [id_code])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "delete success"
            })
        })
        .catch(()=>{
            res.status(404)
            const error = new Error("code not found")
            next(error)
        })
    }else{
        const error = new Error("not an admin")
        next(error)
    }

}

const cancel = async (req, res, next)=>{
    let query
    const username = req.user.username
    const id_history = req.params.id_history
    const [rows] = await db.query('select * from history where id = ?', [id_history])
    const historyData = rows[0]
    const [postData] = await db.query('select * from post where id = ?', [historyData.id_post])
    const post = postData[0]
    if(historyData.username_buyer == username){
        query1 = 'select * from user where username = ?'
        const [rows1] = await db.query(query1, [historyData.username_buyer])
        const [rows2] = await db.query(query1, [historyData.username_seller])
        const buyer = rows1[0]
        const seller = rows2[0]
        query2 = 'update user set balance = ? where username = ?'
        await db.query(query2, [(buyer.balance + historyData.totalPrice), historyData.username_buyer], 
                    query2, [(seller.balance - historyData.totalPrice), historyData.username_seller],
                    'update post set stock = ? where id = ?', [(post.stock + historyData.number), post.id])
        .then(()=>{
            db.query('delete from history where id = ?', [id_history])
            res.json({
                "success" : true,
                "message" : "Transaction canceled"
            })
        })
        .catch(()=>{
            res.status(404)
            const error = new Error("History not found")
            next(error)
        })
    }else{
        const error = new Error("It's not your transaction")
        next(error)
    }
}

const transactionController = {
    topUp,
    buy,
    createCode,
    deleteCode,
    cancel
}

module.exports = transactionController