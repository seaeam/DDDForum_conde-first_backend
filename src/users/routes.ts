import { Router } from 'express'
import { createUser, editUser, editUserAvatar, fetchUserByEmail } from './api'

const router: Router = Router()

router.post('/users/new', createUser)
router.post('/users/edit', editUser)
router.get('/users', fetchUserByEmail)
router.post('/avatar', editUserAvatar)

export default router
