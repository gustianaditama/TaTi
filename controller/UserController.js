require('dotenv').config()
const db = require('../database')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const JWT_KEY = process.env.JWT_KEY

const getAllUser = async (req, res, next) => {
    try {
        const [rows] = await db.query('select * from user')
        res.json({
            "success": true,
            "data": rows
        })
    } catch (err) {
        next(err)
    }
}

const getUserById = async(req, res, next)=>{
    const id = req.params.id
    const [rows] = await db.query('select * from user where id = ?', [id])
    if(rows.length > 0){
        res.json({
            "success" : true,
            "username" : rows[0]
        })
    }else{
        res.status(404)
        const error = new Error("User not Found")
        next(error)
    }
}

const registerUser = async (req, res, next) =>{
    const username = req.body.username
    const nickname = req.body.nickname
    const address = req.body.address
    const phone = req.body.phone
    const email = req.body.email
    const role = req.body.role
    const isEmail = validator.isEmail(email)
    if (isEmail) {
        const [users] = await db.query('select * from user where username = ? limit 1', [username])
        if(users.length == 0){
            const [rows] = await db.query('select * from user where email = ? limit 1',
                [email])
            if (rows.length == 0) {
                const password = await bcrypt.hash(req.body.password, 11)
                db.query('insert into user(username, address, nickname, phone, email, password, role) values(?,?,?,?,?,?,?)',
                    [username, address, nickname, phone, email, password, role])
                    .then(()=>{
                        res.json({
                            "success" :true,
                            "message" : "Register success!"
                        })
                    })
                    .catch((err)=>{
                        res.status(500)
                        res.json({
                            "success" : false,
                            "error" : err
                        })
                    })
            }
            else {
                res.status(409)
                const error = new Error("Email already registered")
                next(error)
            }
        }else{
            res.status(409)
            const error = new Error("username already registered")
            next(error)
        }
    }else{
        res.status(409)
            const error = new Error("Your email is incorrect")
            next(error)
    }

}

const loginUser = async (req, res, next) => {
    const email = req.body.email
    const [rows] = await db.query('select * from user where email = ?',
        [email])
    if (rows.length != 0) {
        const user = rows[0]
        const password = req.body.password
        const isVerified = await bcrypt.compare(password, user.password)
        if (isVerified) {
            const payload = {
                "id_user": user.id,
                "username": user.username,
                "role" : user.role
            }
            const token = await jwt.sign(payload, JWT_KEY)
            if (token) {
                res.json({
                    "success": true,
                    "token": token
                })
            } else {
                res.status(406)
                const error = new Error("JWT Error, cant create token")
                next(error)
            }
        }
        else {
            res.json(403)
            const error = new Error("Wrong password")
            next(error)
        }
    } else {
        res.json(409)
        const error = new Error("U seems not registered yet")
        next(error)
    }
}

const updateUserName = (req, res, next)=>{
    const id = req.params.id
    const newUsername = req.body.newUsername
    const newNickname = req.body.newNickname
    db.query('update user set username = ? and nickname =? where id = ?', [newUsername, newNickame, id])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "change Name success"
            })
        })
        .catch(()=>{
            res.status(404)
            const error = new Error("User Not Found")
            next(error)
        })
}

const updatePassword = async (req, res, next)=>{
    const id = req.params.id
    const newPassword = req.body.newPassword
    const hashedNewPassword = await bcrypt.hash(newPassword, 11)
    db.query('update user set password = ? where id = ?', [hashedNewPassword, id])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "password updated!"
            })
        })
        .catch(()=>{
            res.status(403)
            const error = new Error("Forbidden password")
            next(error)
        })
}

const deleteUser = async (req, res, next)=>{
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, process.env.JWT_KEY)
    if(verify.role == 1){
        const username = req.body.username
        db.query('delete from user where username = ?', [username])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "delete success"
            })
        })
        .catch(()=>{
            res.status(404)
            const error = new Error("User not found")
            next(error)
        })
    }else{
        const error = new Error("not an admin")
        next(error)
    }
}

const userController = {
    getAllUser,
    registerUser,
    getUserById,
    updateUserName,
    loginUser,
    updatePassword,
    deleteUser
}

module.exports = userController