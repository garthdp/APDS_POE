//calling express
//define all constants
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const https = require('https')
const fs = require('fs')
const path = require('path')
// const csrf = require('csurf')
// const cookieParser = require('cookie-parser')

//imports
const userRoutes = require('./routes/users')
const transactionRoutes = require('./routes/transactions')

//creating express package
const app = express()

//sanitize json requests
app.use(express.json())
// app.use(cookieParser())


// //set up csurf middleware
// app.use(csrf({
//     cookie:{
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'Lax'//strict and none
//     }
// }))

// we need to update our api to use csrf toke since we dont have a login yet we create a call
// app.get('/api/csrf-token', (res, req) => {
//     res.json({csrfToken: req.csrfToken})
// })

// //middleware to expose csurf token in response
// app.use((req, res, next) =>{
//     res.locals.csrfToken = req.csrfToken()
//     console.log(req.path, req.method)
//     next()
// })

app.use('/api/users', userRoutes)
app.use('/api/transaction', transactionRoutes)

//creatng ssl server
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)

//connecting to mongodb
mongoose.connect(process.env.MONGO_URI)
.then(() => {
        sslServer.listen(process.env.PORT, () => {
            console.log("HTTPS now running")
        })
})
.catch((error)=>{
    console.log(error)
})
