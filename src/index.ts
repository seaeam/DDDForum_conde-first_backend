import process from 'node:process'
import express, { Router } from 'express'
import postRouter from './posts/routes'
import userRouter from './users/routes'

const app = express()

const notifyRoute = Router()
notifyRoute.get('/', (_, res) => {
  res.send('hello from DDDForum backend╰(￣▽￣)╭')
})

app.use(express.json())
app.use(notifyRoute, postRouter, userRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on ${port}`)
})
