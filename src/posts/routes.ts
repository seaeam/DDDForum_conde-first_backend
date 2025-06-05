import { Router } from 'express'
import { getRecentPosts } from './api'

const router: Router = Router()

router.get('/posts', getRecentPosts)

export default router
