import { Router } from 'express'
import { createUser, editUser, getUserByEmail } from './api'

const router: Router = Router()

router.post('/users/new', createUser)
router.post('/users/edit', editUser)
router.get('/users', getUserByEmail)

export default router
