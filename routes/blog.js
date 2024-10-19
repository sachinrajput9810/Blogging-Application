const {Router} = require('express')
const router = Router()
const multer = require('multer')
const path = require('path')
const Blog = require('../models/blog')
const Comment = require('../models/comment')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null , fileName)
    }
  })

const upload = multer({ storage: storage })

router.get('/add-new' , (req , res) => {
    return res.render('addBlog' , {
        user : req.user
    })
})

router.post('/' , upload.single('coverImage') ,async (req , res) => {
    const {title , body} = req.body ;
    const blog = await Blog.create({
        title : title ,
        body : body ,
        createdBy : req.user._id ,
        coverImageURL : `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`)
})

router.get('/:id' ,async (req , res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const comments = await Comment.find({blogId : req.params.id}).populate('createdBy') 
    console.log("Comments : " , comments) ;
    return res.render('blog' , {
        user : req.user ,
        blog ,
        comments ,
    })
})

router.post('/comment/:blogId' ,async (req , res) => {
    if(req.body.content === "") return res.redirect(`/blog/${req.params.blogId}`)
    await Comment.create({
        content : req.body.content ,
        createdBy : req.user._id ,
        blogId : req.params.blogId
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router