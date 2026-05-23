
import express from 'express'
// import cookieParser from 'cookies-parser'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import blogRoutes from './routes/blog.routes.js'
import cors from 'cors'




const app = express()
app.use(express.json())
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))


app.use('/api/auth',authRoutes)

app.use('/api/blog',blogRoutes)



export default app