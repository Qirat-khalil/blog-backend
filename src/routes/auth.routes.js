import express from 'express'
import { userLogin, userLogout, userRegister } from '../controllers/auth.controller.js'
import authMiddleware from '../middleware/auth.middlleware.js'



const router =  express.Router()


router.post('/register' , userRegister)
router.post('/login' , userLogin)
router.post('/logout', userLogout)

router.get("/currentuser", authMiddleware, (req, res) => {
  res.json({
    user: req.user
  });
});


export default router