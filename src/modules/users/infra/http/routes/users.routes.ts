import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@config/upload'
const userRoutes = Router()
const upload = multer(uploadConfig)

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated'

import UserController from '../controllers/UserController'
import UserAvatarController from '../controllers/UserAvatarController'

const userController = new UserController()
const userAvatarController = new UserAvatarController()

userRoutes.post('/', userController.create)

userRoutes.patch('/avatar', ensureAuthenticated, upload.single('avatar'),userAvatarController.update)

export default userRoutes