import Appointment from '../infra/typeorm/entities/Appointment'
import { startOfHour } from 'date-fns'
import {inject,injectable} from 'tsyringe'
import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'


interface IRequestDTO {
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository:IAppointmentsRepository
        ){}

    public async  execute({ provider_id, date }: IRequestDTO): Promise<Appointment> {

        const appointmentDate = startOfHour(date)

        const findAppointmentInSameDate = await this.appointmentRepository.findByDate(appointmentDate)

        if (findAppointmentInSameDate) {
            throw new AppError('This appoitment is already booked.')
        }

        const appointment = await this.appointmentRepository.create({
            provider_id,
            date: appointmentDate
        })

        return appointment

    }
}

export default CreateAppointmentService