import { getRepository, Not, Repository } from 'typeorm'
import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import IFindoAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO'


class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>
    constructor() {
        this.ormRepository = getRepository(User)
    }

    public async findAllProviders({except_user_id}:IFindoAllProvidersDTO): Promise<User[]> {
        let users: User[];
        const { ormRepository } = this
        if (except_user_id) {
            users = await ormRepository.find({
                where: {
                    id: Not(except_user_id)
                }
            })

        } else {
            users = await ormRepository.find()
        }

        return users
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = this.ormRepository.findOne(id)
        return user
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = this.ormRepository.findOne({
            where: { email }
        })
        return user
    }

    public async create({ name, email, password }: ICreateUserDTO): Promise<User> {
        const user = await this.ormRepository.create({
            name,
            email,
            password
        })

        await this.ormRepository.save(user)

        return user
    }
    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user)
    }

}

export default UsersRepository