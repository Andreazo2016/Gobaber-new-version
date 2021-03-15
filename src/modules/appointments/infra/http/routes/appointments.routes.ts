import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import AppointmentController from '../controllers/AppointmentController'
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController'

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated'

const appointmentRoutes = Router()

const appointmentController = new AppointmentController()
const providerAppointmentsController = new ProviderAppointmentsController()

appointmentRoutes.use(ensureAuthenticated)


appointmentRoutes.post('/', celebrate({
    [Segments.BODY]: {
        provider_id: Joi.string().uuid().required(),
        date: Joi.date().required()
    }
}), appointmentController.create)
appointmentRoutes.get('/me', providerAppointmentsController.index)

export default appointmentRoutes