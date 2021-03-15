import Appointment from '../infra/typeorm/entities/Appointment'
import { startOfHour, isBefore, getHours, format } from 'date-fns'
import { inject, injectable } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'


interface IRequestDTO {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentsRepository,
        @inject('NotificationsRepository')
        private notificationRepository: INotificationsRepository
    ) { }

    public async execute({ provider_id, user_id, date }: IRequestDTO): Promise<Appointment> {

        const appointmentDate = startOfHour(date)

        if (isBefore(appointmentDate, Date.now())) throw new AppError(`you can not create an appointment on past date`)

        if (user_id === provider_id) throw new AppError(`you can not create an appointment for youself`)

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) throw new AppError(`you can nonly create appointment after 8 and before 17`)

        const findAppointmentInSameDate = await this.appointmentRepository.findByDate(appointmentDate)

        if (findAppointmentInSameDate) throw new AppError('This appoitment is already booked.')


        const appointment = await this.appointmentRepository.create({
            provider_id,
            user_id,
            date: appointmentDate
        })

        const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'ás' HH:mm")

        await this.notificationRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para o dia ${dateFormatted}`
        })

        return appointment

    }
}

export default CreateAppointmentService