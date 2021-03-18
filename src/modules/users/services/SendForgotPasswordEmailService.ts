import path from 'path'
import { injectable, inject } from 'tsyringe'
import AppError from '@shared/errors/AppError'
import IUserRepository from '../repositories/IUsersRepository'
import IUserTokensRepository from '../repositories/IUserTokensRepository'
import IEmailProvider from '@shared/container/providers/mailProvider/models/IMailProvider'



interface IRequest {
  email: string;
}


@injectable()
class SendForgotPasswordEmailService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('MailProvider')
    private emailProvider: IEmailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) { }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)


    if (!user) {
      throw new AppError('User does not exists.')
    }

    const { token } = await this.userTokensRepository.generate(user.id)

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs')


    // await this.emailProvider.sendEmail({
    //   to: {
    //     name: user.name,
    //     email: user.email
    //   },
    //   subject: '[GoBarber] Recuperação de senha',
    //   templateData: {
    //     templateFileContent: forgotPasswordTemplate,
    //     variables: {
    //       name: user.name,
    //       link: `http://localhost:3000/reset_password?token=${token}`
    //     }
    //   }
    // })
  }
}

export default SendForgotPasswordEmailService