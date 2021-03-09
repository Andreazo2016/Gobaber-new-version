import { Router } from 'express'
import AppointmentRoutes from '@modules/appointments/infra/http/routes/appointments.routes'
import ProvidersRoutes from '@modules/appointments/infra/http/routes/providers.routes'
import UsersRoutes from '@modules/users/infra/http/routes/users.routes'
import SessionsRoutes from '@modules/users/infra/http/routes/session.routes'
import PasswordRoutes from '@modules/users/infra/http/routes/password.routes'
import PofileRoutes from '@modules/users/infra/http/routes/profile.routes'



const routes = Router()

routes.use("/appoitments", AppointmentRoutes)
routes.use("/users", UsersRoutes)
routes.use("/sessions", SessionsRoutes)
routes.use("/passwords", PasswordRoutes)
routes.use("/profiles", PofileRoutes)
routes.use("/providers", ProvidersRoutes)

export default routes