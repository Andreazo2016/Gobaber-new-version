import AppError from '@shared/errors/AppError'
import FakeStorageProvider from '@shared/container/providers/storageProvider/fake/FakeStorageProvider'
import FakeUserRepository from '../repositories/fake/FakeUserRepository'
import UpdateUserAvatarService from './UpdateUserAvatarService'

interface SutTypes {
    fakeUserRepository: FakeUserRepository;
    fakeStorageProvider: FakeStorageProvider;
    updateUserAvatarService: UpdateUserAvatarService
}

const makeSut = (): SutTypes => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeStorageProvider = new FakeStorageProvider()
    const updateUserAvatarService = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider)
    return {
        fakeUserRepository,
        fakeStorageProvider,
        updateUserAvatarService
    }

}


describe('UpdateUserAvatar', () => {

    it('should be able to update user avatar', async () => {

        const { fakeUserRepository, updateUserAvatarService } = makeSut()

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        })

        expect(user.avatar).toBe('avatar.jpg')

    })

    it('should be able to update avatr non existing user', async () => {

        const { updateUserAvatarService } = makeSut()

        const response = updateUserAvatarService.execute({
            user_id: 'non-existing-user',
            avatarFilename: 'avatar.jpg'
        })

        expect(response).rejects.toBeInstanceOf(AppError)

    })

    it('should delete old avatar when updating a new one', async () => {
        const { fakeUserRepository, fakeStorageProvider, updateUserAvatarService } = makeSut()

        //Verifica se a função foi chamada - (Espiona ela)
        const functionDeleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        })

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg'
        })

        expect(functionDeleteFile).toHaveBeenCalledWith('avatar.jpg')
        expect(user.avatar).toBe('avatar2.jpg')

    })


})