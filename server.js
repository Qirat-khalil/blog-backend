import dotenv from 'dotenv'
// dotenv.config()

const result = dotenv.config({ path: './.env' })

console.log(result)

console.log(process.cwd())
console.log(process.env.PUBLIC_KEY)

console.log("publiccccccccccc",process.env.PUBLIC_KEY)
import app from "./src/app.js";
import connectDB from "./src/db/db.js";


connectDB()



app.listen(3000,()=>{
    console.log('server is running');
    
})