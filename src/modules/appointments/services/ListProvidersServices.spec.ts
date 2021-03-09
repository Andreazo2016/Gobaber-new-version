import AppError from '@shared/errors/AppError'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import ListProvidersServices from './ListProvidersServices'

interface SutTypes {
    fakeUserRepository: FakeUserRepository;
    listProvidersServices: ListProvidersServices
}

const makeSut = (): SutTypes => {

    const fakeUserRepository = new FakeUserRepository()

    const listProvidersServices = new ListProvidersServices(fakeUserRepository)

    return {
        fakeUserRepository,
        listProvidersServices
    }

}


describe('ListProvidersService', () => {

    it('should be able to list providers', async () => {

        const { fakeUserRepository, listProvidersServices } = makeSut()

        const user01 = await fakeUserRepository.create({
            name: 'John Trê',
            email: 'johntreexample.com',
            password: '123321a'
        })

        const user02 = await fakeUserRepository.create({
            name: 'John Doe two',
            email: 'johndoetwo@example.com',
            password: '123321a'
        })

        const loggedUser = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        const providers = await listProvidersServices.execute({
            user_id: loggedUser.id
        })

        expect(providers.length).toBe(2)
        expect(providers).toEqual([user01, user02])

    })
})