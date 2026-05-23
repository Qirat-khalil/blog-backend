import mongoose from "mongoose";



const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        //    unique:true
    },
    // detail: {
    //     type: String,
    //     required: true
    // },
    description: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    topic: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    image: {
        type: String,
        required: true
    },
    
    imageFileId: {
        type: String
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],


    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true })


const blogModel = mongoose.model('blog', blogSchema)

export default blogModel