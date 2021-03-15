import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import SessionController from '../controllers/SessionController'

const sessionRoutes = Router()

const sessionController = new SessionController()

sessionRoutes.post('/', celebrate({
    [Segments.BODY]: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }
}), sessionController.create)

export default sessionRoutes