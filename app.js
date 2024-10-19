require('dotenv').config()
const express = require('express')
const path = require('path')
const Blog = require('./models/blog')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const {checkForAuthenticationCookie} = require('./middlewares/authentication')
const PORT = process.env.PORT || 3000;

// Routers
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(e => console.log("MongoDB connected"))
 

const app = express()

app.set("view engine" , 'ejs')
app.set('views' , path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))



app.get('/' ,async (req , res) => {
    const allBlogs = await Blog.find({})
    res.render('home' , {
        user : req.user ,
        blogs : allBlogs
    })
})


app.use('/user' , userRoute)
app.use('/blog' , blogRoute)

app.listen(PORT , () => {
    console.log(`Server running at ${PORT}`)
})