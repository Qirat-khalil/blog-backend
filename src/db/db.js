import mongoose from "mongoose";



const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_DB_STRING)
        console.log('db connect successfully');
        

    } catch (error) {
        console.log('error in connecting db');

    }
} 


export default connectDB