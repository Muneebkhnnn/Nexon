import express from 'express'
import dotenv from 'dotenv'
import {clerkMiddleware, requireAuth} from '@clerk/express'
import cors from 'cors'
import {errorHandler} from './middleware/errorHandler.js'
import router from './routes/AiRoute.js'

const app=express()

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

const PORT= process.env.PORT || 3000

app.get('/',(req,res)=>res.send('on home page'))

app.use(requireAuth())

app.use('api/v1/ai',router)

app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`server listening on port:${PORT}`)
})


