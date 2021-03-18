import { getRepository, Repository, createConnection, getConnection, Connection } from 'typeorm'
import request from 'supertest'
import app from '@shared/infra/http/app'
import User from '@modules/users/infra/typeorm/entities/User'


let userRepository: Repository<User>
let connection: Connection

describe('UserController', () => {

  beforeEach(async () => {
    await createConnection()
    connection = getConnection()
    if (connection.isConnected) {
      console.log('conectado!!')
      await connection.runMigrations()
      userRepository = getRepository(User)
    } else {
      console.log('conexão fechada ainda!!')
    }
  })

  afterEach(async () => {
    const users = await userRepository.find()
    userRepository.remove(users)
    await connection.undoLastMigration();
    await connection.close()

  })

  it('sould be able to return status code 200 when send email to recovery password', async () => {

    const user = userRepository.create({
      name: 'name_user',
      email: 'email@email.com',
      password: '123321a'
    })

    await userRepository.save(user)


    await request(app)
      .post('/passwords/forgot')
      .set('Accept', 'application/json')
      .send({
        email: 'email@email.com',
      })
      .expect(204)
  })

  it('sould be able to return status code 400 when field email is not provided', async () => {

    const user = userRepository.create({
      name: 'name_user',
      email: 'email@email.com',
      password: '123321a'
    })

    await userRepository.save(user)

    await request(app)
      .post('/passwords/forgot')
      .set('Accept', 'application/json')
      .send({})
      .expect(400)
  })

})