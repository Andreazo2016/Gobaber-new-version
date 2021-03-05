import { Router } from 'express'
import AppointmentController from '../controllers/AppointmentController'

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated'

const appointmentRoutes = Router()

const appointmentController = new AppointmentController()

appointmentRoutes.use(ensureAuthenticated)


// appointmentRoutes.get('/', async (request, response) => {

//     const appointmentsRepository = getCustomRepository(AppointmentsRepository)

//     const appointments = await appointmentsRepository.find()

//     return response.json(appointments)
// })

appointmentRoutes.post('/', appointmentController.create)

export default appointmentRoutes