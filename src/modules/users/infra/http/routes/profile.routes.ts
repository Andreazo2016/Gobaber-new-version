import { Router } from 'express'

const profileRoutes = Router()

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated'

import ProfileController from '../controllers/ProfileController'

const profileController = new ProfileController()

profileRoutes.use(ensureAuthenticated)

profileRoutes.get('/', profileController.show)
profileRoutes.put('/', profileController.update)

export default profileRoutes