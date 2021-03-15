import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderAppointmentsService from './ListProviderAppointmentsService'

interface SutTypes {
    fakeAppointmentsRepository: FakeAppointmentsRepository;
    listProviderAppointmentsService: ListProviderAppointmentsService
}

const makeSut = (): SutTypes => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const listProviderAppointmentsService = new ListProviderAppointmentsService(fakeAppointmentsRepository)

    return {
        fakeAppointmentsRepository,
        listProviderAppointmentsService
    }

}


describe('ListProvidersService', () => {

    it('should be able to list the appointments on a specific day', async () => {

        const { fakeAppointmentsRepository, listProviderAppointmentsService } = makeSut()

        const appointment01 = await fakeAppointmentsRepository.create({
            provider_id: "provider",
            user_id: 'user',
            date: new Date(2020, 4, 19, 14, 0, 0)
        })

        const appointment02 = await fakeAppointmentsRepository.create({
            provider_id: "provider",
            user_id: 'user',
            date: new Date(2020, 4, 19, 15, 0, 0)
        })



        const appointments = await listProviderAppointmentsService.execute({
            provider_id: "provider",
            day: 19,
            month: 5,
            year: 2020,
        })

        expect(appointments).toEqual([
            appointment01,
            appointment02
        ])

    })
})