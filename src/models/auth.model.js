import mongoose from "mongoose";



const authSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 16
    },
    email: {
        type: String,
        required: true,
        trim: true,
        // unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        // unique: true,
        minlength: 8
    }
    
},{ timestamps: true })



const userModel = mongoose.model('user',authSchema)

export default userModel