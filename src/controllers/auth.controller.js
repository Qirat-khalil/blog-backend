import userModel from "../models/auth.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";

const userRegister = async (req, res) => {
    try {

        const { username, email, password } = req.body


        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }


        // email mn .om bhi likh rhi hun tw register hojarha h 

        //    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }


        if (password.length < 8) {
            return res.status(400).json({
                message: "Password too weak"
            });
        }

        const isEmailUnique = await userModel.findOne({
            email
        })

        if (isEmailUnique) {
            return res.status(400).json({
                message: 'this email is already exist'
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const createUser = await userModel.create({
            username,
            email,
            password:hash
        })


        const token = jwt.sign({ id: createUser._id }, process.env.JWT_SECRET_KEY)

        res.cookie("token", token)

        res.status(201).json({
            message: 'user register successfully',
            createUser: {
                _id: createUser.id,
                username: createUser.username,
                email: createUser.email
            }
        })

    } catch (error) {
        console.log('error in authentication');
        res.status(500).json({
            message: 'error in registration' + error.message
        })

    }
}



const userLogin = async (req, res) => {

    try {
        const { email, password } = req.body

        const user = await userModel.findOne({
            email,
        })

        if (!user) {
            return res.status(400).json({
                message: 'invalid credentials '
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'invalid credentials '
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)

        res.cookie('token', token)

        res.status(200).json({
            message: 'user login successfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({
            message: error.message + 'error.login'
        })
    }
}


const userLogout = async (req, res) => {
  try {

   
    res.clearCookie("token");

    res.status(200).json({
      message: "User logout successfully"
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: error.message + " error logout"
    });
  }
};

export { userRegister, userLogin , userLogout }