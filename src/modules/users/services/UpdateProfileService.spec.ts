import AppError from '@shared/errors/AppError'
import FakeUserRepository from '../repositories/fake/FakeUserRepository'
import FakeHashProvider from '../providers/hashProvider/fake/FakeHashProvider'
import UpdateProfileService from './UpdateProfileService'

interface SutTypes {
    fakeUserRepository: FakeUserRepository;
    fakeHashProvider: FakeHashProvider;
    updateProfileService: UpdateProfileService
}

const makeSut = (): SutTypes => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeHashProvider = new FakeHashProvider()
    const updateProfileService = new UpdateProfileService(fakeUserRepository, fakeHashProvider)
    return {
        fakeUserRepository,
        fakeHashProvider,
        updateProfileService
    }

}


describe('UpdateProfile', () => {

    it('should be able to update the profile', async () => {

        const { fakeUserRepository, updateProfileService } = makeSut()

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com'
        })

        expect(updatedUser.name).toBe('John Trê')
        expect(updatedUser.email).toBe('johntre@example.com')

    })

    it('should not be able to change to another user email', async () => {

        const { fakeUserRepository, updateProfileService } = makeSut()

        await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })
        const user = await fakeUserRepository.create({
            name: 'Teste',
            email: 'teste@example.com',
            password: '123321a'
        })

        const response = updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johndoe@example.com'
        })

        expect(response).rejects.toBeInstanceOf(AppError)

    })

    it('should  be able to update the password', async () => {

        const { fakeUserRepository, updateProfileService } = makeSut()

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johndoe@example.com',
            old_password: '123321a',
            password: '123321b'
        })

        expect(updatedUser.password).toBe('123321b')

    })

    it('should not be able to update the password without old passowrd', async () => {

        const { fakeUserRepository, updateProfileService } = makeSut()

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        const response = updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johndoe@example.com',
            password: '123321b'
        })

        expect(response).rejects.toBeInstanceOf(AppError)

    })

    it('should not be able to update the password with wrong old passowrd', async () => {

        const { fakeUserRepository, updateProfileService } = makeSut()

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        const response = updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johndoe@example.com',
            old_password: 'wrong-old-password',
            password: '123321b'
        })

        expect(response).rejects.toBeInstanceOf(AppError)

    })


})