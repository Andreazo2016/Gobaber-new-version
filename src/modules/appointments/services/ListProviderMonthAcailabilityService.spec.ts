import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderMonthAcailabilityService from './ListProviderMonthAcailabilityService'

interface SutTypes {
    fakeAppointmentsRepository: FakeAppointmentsRepository;
    listProviderMonthAcailabilityService: ListProviderMonthAcailabilityService
}

const makeSut = (): SutTypes => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const listProviderMonthAcailabilityService = new ListProviderMonthAcailabilityService(fakeAppointmentsRepository)

    return {
        fakeAppointmentsRepository,
        listProviderMonthAcailabilityService
    }

}


describe('ListProvidersService', () => {

    it('should be able to list the month availability from provider', async () => {

        const { fakeAppointmentsRepository, listProviderMonthAcailabilityService } = makeSut()

        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 19, 8, 0, 0)
        })
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 19, 9, 0, 0)
        })
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 19, 10, 0, 0)
        })
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 19, 11, 0, 0)
        })
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 19, 12, 0, 0)
        })
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 19, 13, 0, 0)
        })
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 19, 14, 0, 0)
        })
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 19, 15, 0, 0)
        })
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 19, 16, 0, 0)
        })
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 19, 17, 0, 0)
        })
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            user_id:'user',
            date: new Date(2020, 4, 20, 18, 0, 0)
        })


        const availability = await listProviderMonthAcailabilityService.execute({
            provider_id: "user",
            year: 2020,
            month: 5
        })

        expect(availability).toEqual(expect.arrayContaining([
            { day: 19, available: false },
            { day: 20, available: true },
            { day: 21, available: true },
            { day: 22, available: true },
        ]))

    })
})