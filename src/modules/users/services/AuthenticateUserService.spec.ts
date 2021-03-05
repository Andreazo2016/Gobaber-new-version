import AppError from '@shared/errors/AppError'
import FakeUserRepository from '../repositories/fake/FakeUserRepository'
import FakeHashProvider from '../providers/hashProvider/fake/FakeHashProvider'
import CreateUserService from './CreateUserService'
import AuthenticateUserService from './AuthenticateUserService'

interface SutTypes {
    fakeUserRepository: FakeUserRepository;
    fakeHashProvider: FakeHashProvider;
    authenticateUserService: AuthenticateUserService;
    createUserService: CreateUserService
}

const makeSut = (): SutTypes => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeHashProvider = new FakeHashProvider()
    const authenticateUserService = new AuthenticateUserService(fakeUserRepository, fakeHashProvider)
    const createUserService = new CreateUserService(fakeUserRepository, fakeHashProvider)
    return {
        fakeUserRepository,
        fakeHashProvider,
        authenticateUserService,
        createUserService,
    }
}

describe('AuthenticateUser', () => {
    it('should be able to authentitcate', async () => {

        const { createUserService, authenticateUserService } = makeSut()

        await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })
        const response = await authenticateUserService.execute({
            email: 'johndoe@example.com',
            password: '123321a'
        })

        expect(response).toHaveProperty("token")

    })

    it('should be able to authentitcate with non existing user', async () => {

        const { authenticateUserService } = makeSut()


        const response = authenticateUserService.execute({
            email: 'johndoe@example.com',
            password: '123321a'
        })

        expect(response).rejects.toBeInstanceOf(AppError)

    })

    it('should be able to authentitcate with incorrect password', async () => {

        const { createUserService, authenticateUserService } = makeSut()

        await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })
        const response = authenticateUserService.execute({
            email: 'johndoe@example.com',
            password: '123321b'
        })

        expect(response).rejects.toBeInstanceOf(AppError)

    })



})