import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

const profileRoutes = Router()

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated'

import ProfileController from '../controllers/ProfileController'

const profileController = new ProfileController()

profileRoutes.use(ensureAuthenticated)

profileRoutes.get('/', profileController.show)
profileRoutes.put('/', celebrate({
    [Segments.BODY]: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        old_password: Joi.string(),
        password: Joi.string(),
        password_confirmation: Joi.string().valid(Joi.ref('password'))
    }
}), profileController.update)

export default profileRoutes