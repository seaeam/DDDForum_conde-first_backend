import process from 'node:process'
import cors from 'cors'
import express, { Router } from 'express'
import { avatarUpload } from './middleware/upload'
import postRouter from './posts/routes'
import userRouter from './users/routes'

const corsOptions = {
  origin: [
    'https://ddd-fourm-code-first-frontend-k979.vercel.app',
    /^https:\/\/ddd-fourm-code-first-frontend.*\.vercel\.app$/,
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

const app = express()

const notifyRoute = Router()
notifyRoute.get('/', (_, res) => {
  res.send('hello from DDDForum backend╰(￣▽￣)╭')
})

app.use(express.json())
app.use(cors(corsOptions))

app.use('/avatar', avatarUpload.single('file'))

app.use(notifyRoute, postRouter, userRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on ${port}`)
})
