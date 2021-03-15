import { Router } from 'express'
import AppointmentController from '../controllers/AppointmentController'
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController'

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated'

const appointmentRoutes = Router()

const appointmentController = new AppointmentController()
const providerAppointmentsController = new ProviderAppointmentsController()

appointmentRoutes.use(ensureAuthenticated)


appointmentRoutes.post('/', appointmentController.create)
appointmentRoutes.get('/me', providerAppointmentsController.index)

export default appointmentRoutes