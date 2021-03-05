import AppError from '@shared/errors/AppError'
import FakeUserRepository from '../repositories/fake/FakeUserRepository'
import FakeUserTokensRepository from '../repositories/fake/FakeUserTokensRepository'
import FakeHashProvider from '../providers/hashProvider/fake/FakeHashProvider'
import ResetPasswordService from './ResetPasswordService'


interface SutTypes {
    fakeUserRepository: FakeUserRepository;
    fakeUserTokensRepository: FakeUserTokensRepository;
    resetPasswordService: ResetPasswordService;
    fakeHashProvider: FakeHashProvider;
}

const makeSut = (): SutTypes => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeUserTokensRepository = new FakeUserTokensRepository()
    const fakeHashProvider = new FakeHashProvider()
    const resetPasswordService = new ResetPasswordService(
        fakeUserRepository,
        fakeUserTokensRepository,
        fakeHashProvider
    )


    return {
        fakeUserRepository,
        fakeUserTokensRepository,
        resetPasswordService,
        fakeHashProvider
    }
}

describe('ResetPasswordService', () => {

    it('should be able to reset the password', async () => {
        const { fakeUserRepository, fakeHashProvider, fakeUserTokensRepository, resetPasswordService } = makeSut()
        let user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        const { token } = await fakeUserTokensRepository.generate(user.id)

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

        await resetPasswordService.execute({
            password: '123321b',
            token
        })

        const updatedUser = await fakeUserRepository.findById(user.id)

        expect(generateHash).toBeCalledWith('123321b')

        expect(updatedUser?.password).toBe('123321b')

    })

    it('should not be able to reset the password with non-existing token', async () => {
        const { resetPasswordService } = makeSut()

        const response = resetPasswordService.execute({
            token: 'non-existing-token',
            password: '123'
        })

        expect(response).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to reset the password with non-existing user', async () => {
        const { resetPasswordService, fakeUserTokensRepository } = makeSut()

        const { token } = await fakeUserTokensRepository.generate('non-existing-user-id')

        const response = resetPasswordService.execute({
            token,
            password: '123'
        })

        expect(response).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to reset the password if passed more than 2 hours', async () => {
        const { fakeUserRepository, fakeHashProvider, fakeUserTokensRepository, resetPasswordService } = makeSut()
        let user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        const { token } = await fakeUserTokensRepository.generate(user.id)

        jest.spyOn(Date,'now').mockImplementationOnce(() => {
            const customDate = new Date()
            return customDate.setHours(customDate.getHours() + 3)
        })

        const response = resetPasswordService.execute({
            password: '123321b',
            token
        })

       expect(response).rejects.toBeInstanceOf(AppError)

    })


})