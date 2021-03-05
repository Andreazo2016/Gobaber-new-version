import AppError from '@shared/errors/AppError'
import FakeUserRepository from '../repositories/fake/FakeUserRepository'
import FakeUserTokensRepository from '../repositories/fake/FakeUserTokensRepository'
import FakeEmailProvider from '@shared/container/providers/mailProvider/fake/FakeMailProvider'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

interface SutTypes {
    fakeUserRepository: FakeUserRepository;
    sendForgotPasswordEmailService: SendForgotPasswordEmailService;
    fakeMailProvider: FakeEmailProvider;
    fakeUserTokensRepository: FakeUserTokensRepository;
}

const makeSut = (): SutTypes => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeUserTokensRepository = new FakeUserTokensRepository()
    const fakeMailProvider = new FakeEmailProvider()
    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
        fakeUserRepository,
        fakeMailProvider,
        fakeUserTokensRepository
    )
    return {
        fakeUserRepository,
        sendForgotPasswordEmailService,
        fakeMailProvider,
        fakeUserTokensRepository
    }
}

describe('SendForgotPasswordEmail', () => {

    it('should be able to recover the password using the email', async () => {
        const { sendForgotPasswordEmailService, fakeUserRepository, fakeMailProvider } = makeSut()

        const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail')

        await fakeUserRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123321a"
        })

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com'
        })

        expect(sendEmail).toHaveBeenCalled()

    })


    it('should not be able to revocer a non-existing user password', async () => {
        const { sendForgotPasswordEmailService } = makeSut()

        const promise = sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com'
        })

        expect(promise).rejects.toBeInstanceOf(AppError)
    })

    it('should generate a forgot password token', async () => {
        const { sendForgotPasswordEmailService, fakeUserRepository, fakeUserTokensRepository } = makeSut()

        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

        const user = await fakeUserRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123321a"
        })

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com'
        })


        /**
         * Verifica que se o metodo generate do fakeUserToken foi chamado dentro do envio de 
         * email com o id do usuário sendo passo por parâmetro
         * 
         */
        expect(generateToken).toHaveBeenCalledWith(user.id)

    })
})