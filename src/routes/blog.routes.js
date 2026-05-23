import express from 'express'
import { addComment, deleteBlog, fetchBlog, getAllBlog, toggleLike, updateBlog, UserBlog } from '../controllers/blog.controller.js'
import authMiddleware from '../middleware/auth.middlleware.js'
import multer, { memoryStorage } from 'multer'

const uploadFile = multer({storage: multer.memoryStorage()})



const router =  express.Router()


router.post('/createblog' , authMiddleware, uploadFile.single('image'), UserBlog)

router.get('/getallblog' , getAllBlog)

router.get('/fetchblog/:topic' , fetchBlog)

router.put('/updateblog/:id' ,authMiddleware,uploadFile.single('image'), updateBlog)

router.delete('/deleteblog/:id' ,authMiddleware, deleteBlog)

router.put('/likes/:id', authMiddleware, toggleLike)

router.post('/comment/:id', authMiddleware, addComment)


export default router