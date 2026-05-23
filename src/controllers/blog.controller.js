
import blogModel from "../models/blog.model.js";
// import { uploadImage, deleteImage } from "../services/storage.services.js";
import { uploadImage, deleteImage } from '../services/storage.services.js'

// =======create blog

const UserBlog = async (req, res) => {

    try {

        const { title, content, topic, description } = req.body

        if (!title || !content || !topic || !description || !req.file) {
            return res.status(400).json({
                message: 'fill all the field'
            })
        }


        const existBlog = await blogModel.findOne({
            title,
            topic,
            user: req.user.id
        });

        if (existBlog) {
            return res.status(400).json({
                message: 'Blog already exists'
            });
        }

        console.log(req.file);

        const file = await uploadImage(req.file.buffer)
        console.log(file);


        const createBlog = await blogModel.create({
            title,
            content,
            topic,
            description,
            user: req.user.id,
            image: file.url,
            imageFileId: file.fileId
        })

        res.status(201).json({
            message: "Blog created successfully",
            createBlog
        });

    } catch (error) {
        console.log('error in blog');
        res.status(500).json({
            message: "Error creating blog"
        });
    }
}




// =============fetch blog

const fetchBlog = async (req, res) => {
    try {

        const { topic } = req.params;

        const blogs = await blogModel.find({ topic })
            .populate('user', 'username')

            .populate('comments.user', 'username');

        if (!blogs || blogs.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json({
            message: 'fetch blog successfully',
            blogs
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// ======================= get all blog

const getAllBlog = async (req, res) => {
    try {

        // const { id } = req.params;

        const blogs = await blogModel.find()
            .populate('user', 'username')

            .populate('comments.user', 'username');

        // if (blogs.length === 0) {
        //     return res.status(404).json({
        //         message: 'No blogs found for this '
        //     });
        // }
        if (!blogs || blogs.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json({
            message: 'fetch all blog successfully',
            blogs
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// ==================update blog



const updateBlog = async (req, res) => {

    try {

        const { id } = req.params

        // find blog first
        const blogfind = await blogModel.findById(id)

        if (!blogfind) {

            return res.status(404).json({
                message: 'Blog not found'
            })
        }

        // authorization
        if (blogfind.user.toString() !== req.user.id) {

            return res.status(403).json({
                message: 'Not authorized'
            })
        }

        let updateData = {}

        // text fields
        if (req.body.title)
            updateData.title = req.body.title

        if (req.body.content)
            updateData.content = req.body.content

        if (req.body.description)
            updateData.description =
                req.body.description

        if (req.body.topic)
            updateData.topic =
                req.body.topic


        // image update
        if (req.file) {

            // delete old image
            if (blogfind.imageFileId) {

             const check =    await deleteImage(blogfind.imageFileId)
             console.log('check--->',check);
            }
            

            // upload new image
            const file =
                await uploadImage(req.file.buffer)

            // save new image data
            updateData.image = file.url

            updateData.imageFileId = file.fileId
        }

        // check empty update
        if (
            Object.keys(updateData).length === 0
        ) {

            return res.status(400).json({
                message:
                    'No data provided to update'
            });
        }

        // update blog
        const blogupdate =
            await blogModel.findByIdAndUpdate(

                id,

                updateData,

                { new: true }

            )

        res.status(200).json({

            message:
                'update blog successfully',

            blogupdate
        })

    } catch (error) {

        console.log(
            'error in updated blog'
        );

        res.status(500).json({

            message:
                'error in update blog '
                + error.message
        })
    }
}




// ============delete blog

const deleteBlog = async (req, res) => {

    try {

        const { id } = req.params;

        const blog = await blogModel.findById(id);

        if (!blog) {

            return res.status(404).json({
                message: 'blog not found'
            });
        }

        if (
            blog.user.toString() !== req.user.id) {

            return res.status(403).json({
                message: 'not authorized'
            });
        }

        // delete image from imagekit

        if (blog.imageFileId) {

            await deleteImage(blog.imageFileId)
        }

        await blogModel.findByIdAndDelete(id);

        res.status(200).json({
            message:
                'delete blog successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};




const toggleLike = async (req, res) => {

    try {

        const blogId = req.params.id
        const userId = req.user.id

        const blog = await blogModel.findById(blogId)

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            })
        }

        // check already liked
        const alreadyLiked = blog.likes.includes(userId)

        if (alreadyLiked) {

            // unlike
            blog.likes = blog.likes.filter(
                (id) => id.toString() !== userId
            )

        } else {

            // like
            blog.likes.push(userId)
        }

        await blog.save()

        res.status(200).json({
            message: alreadyLiked
                ? "Blog unliked"
                : "Blog liked",

            likesCount: blog.likes.length,

            isLiked: !alreadyLiked
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })
    }
}



const addComment = async (req, res) => {

    try {

        const blogId = req.params.id;
        const userId = req.user.id;

        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: "Comment required"
            });
        }

        // FIND BLOG
        const blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // PUSH COMMENT
        blog.comments.push({
            user: userId,
            text
        });

        // SAVE
        await blog.save();

        // POPULATE AFTER SAVE
        await blog.populate(
            "comments.user",
            "username"
        );

        // LAST COMMENT
        const newComment =
            blog.comments[blog.comments.length - 1];

        res.status(200).json({
            message: "Comment added",
            newComment,
            comments: blog.comments
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};






export { UserBlog, fetchBlog, updateBlog, deleteBlog, getAllBlog, addComment, toggleLike }















