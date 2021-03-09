import AppError from '@shared/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

interface SutTypes {
    fakeAppointmentsRepository: FakeAppointmentsRepository;
    createAppointmentService: CreateAppointmentService;
}

const sut = (): SutTypes => {

    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository)

    return {
        fakeAppointmentsRepository,
        createAppointmentService
    }
}


describe('CreateAppointment', () => {

    it('should be able to create a new appointment', async () => {

        const { createAppointmentService } = sut()

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime()
        })


        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: "user_id",
            provider_id: 'provider_id'
        })

        expect(appointment).toHaveProperty('id')
        expect(appointment.provider_id).toBe('provider_id')

    })


    it('should not be able to create two appointment on the same time', async () => {

        const { createAppointmentService } = sut()

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime()
        })

        const appointmentDate = new Date(2020, 4, 10, 13)

        await createAppointmentService.execute({
            date: appointmentDate,
            user_id: "user_id",
            provider_id: 'provider_id'

        })

        const promise = createAppointmentService.execute({
            date: appointmentDate,
            user_id: "user_id",
            provider_id: 'provider_id'

        })

        expect(promise).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to create an appointment on past date', async () => {

        const { createAppointmentService } = sut()

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime()
        })

        const promise = createAppointmentService.execute({
            date: new Date(2020, 4, 10, 11),
            user_id: "user_id",
            provider_id: 'provider_id'

        })

        expect(promise).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to create an appointments with user as provider', async () => {

        const { createAppointmentService } = sut()

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime()
        })

        const promise = createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: "user_id",
            provider_id: 'user_id'

        })

        expect(promise).rejects.toBeInstanceOf(AppError)
    })


    it('should not be able to create an appointments before 8am and after 5pm', async () => {

        const { createAppointmentService } = sut()

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime()
        })


        const appointmentBefore8am = createAppointmentService.execute({
            date: new Date(2020, 4, 11, 7),
            user_id: "user_id",
            provider_id: 'provider_id'
        })

        const appointmentAfter18pm = createAppointmentService.execute({
            date: new Date(2020, 4, 11, 18),
            user_id: "user_id",
            provider_id: 'provider_id'
        })

        expect(appointmentBefore8am).rejects.toBeInstanceOf(AppError)
        expect(appointmentAfter18pm).rejects.toBeInstanceOf(AppError)

    })





})