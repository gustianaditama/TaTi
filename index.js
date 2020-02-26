const express = require('express')
const app = express()
const port = 9812
const router = require('./router')
const bodyParser = require('body-parser')

require('./database')

app.use(bodyParser.json())

app.use(express.json())

app.use('/', router)

app.listen(port, () =>{
    console.log("Listen to",  port)
})






