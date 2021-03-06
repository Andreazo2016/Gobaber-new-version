import { injectable, inject } from 'tsyringe'
import { isAfter, addHours } from 'date-fns'
import AppError from '@shared/errors/AppError'
import IUserRepository from '../repositories/IUsersRepository'
import IUserTokensRepository from '../repositories/IUserTokensRepository'
import IHashProvider from '../providers/hashProvider/models/IHashProvider'



interface IRequest {
    token: string;
    password: string;
}


@injectable()
class ResetPasswordService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) { }

    public async execute({ password, token }: IRequest): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token)

        if (!userToken) throw new AppError('User token does not exists')

        const user = await this.usersRepository.findById(userToken.user_id)

        if (!user) throw new AppError('User does not exists')

        const compareDate = addHours(userToken.created_at, 2)

        if (isAfter(Date.now(), compareDate)) throw new AppError('Token expired')

        user.password = await this.hashProvider.generateHash(password)

        await this.usersRepository.save(user)
    }
}

export default ResetPasswordService