import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/hashProvider/fake/FakeHashProvider'
import FakeUserRepository from '../repositories/fake/FakeUserRepository'
import CreateUserService from './CreateUserService'


interface SutTypes {
    fakeUserRepository: FakeUserRepository;
    fakeHashProvider: FakeHashProvider;
    createUserService: CreateUserService
}

const makeSut = (): SutTypes => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeHashProvider = new FakeHashProvider()
    const createUserService = new CreateUserService(fakeUserRepository, fakeHashProvider)
    return {
        fakeUserRepository,
        fakeHashProvider,
        createUserService
    }
}

describe('CreateUser', () => {

    it('should be able to create a new user', async () => {
        const { createUserService } = makeSut()

        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        expect(user).toHaveProperty('id')
        expect(user.email).toBe('johndoe@example.com')

    })

    it('should not be able to create a new user with same email from another', async () => {
        const { createUserService } = makeSut()

        await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })


        const response = createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        expect(response).rejects.toBeInstanceOf(AppError)

    })


})