import AppError from '@shared/errors/AppError'
import FakeUserRepository from '../repositories/fake/FakeUserRepository'
import ShowProfileService from './ShowProfileService'

interface SutTypes {
    fakeUserRepository: FakeUserRepository;
    showProfileService: ShowProfileService
}

const makeSut = (): SutTypes => {

    const fakeUserRepository = new FakeUserRepository()

    const showProfileService = new ShowProfileService(fakeUserRepository)
    
    return {
        fakeUserRepository,
        showProfileService
    }

}


describe('ShowProfile', () => {

    it('should be able to show the profile', async () => {

        const { fakeUserRepository, showProfileService } = makeSut()

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123321a'
        })

        const showUser = await showProfileService.execute({
            user_id: user.id,
        })

        expect(showUser.name).toBe('John Doe')
        expect(showUser.email).toBe('johndoe@example.com')

    })

    it('should not be able to show the profile from non-existing user', async () => {

        const { showProfileService } = makeSut()

        const promise = showProfileService.execute({
            user_id: 'non-existing-id',
        })

        expect(promise).rejects.toBeInstanceOf(AppError)

    })

})