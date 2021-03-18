import { getRepository, Repository, createConnection, getConnection, Connection } from 'typeorm'
import request from 'supertest'
import app from '@shared/infra/http/app'
import User from '@modules/users/infra/typeorm/entities/User'


describe('UserController', () => {
  let userRepository: Repository<User>
  let connection: Connection

  beforeAll(async () => {
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

  afterAll(async () => {
    const users = await userRepository.find()
    userRepository.remove(users)
    await connection.undoLastMigration();
    await connection.close()
  })

  it('sould be able return 200 ok', async () => {

    await request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send({
        name: 'name_user',
        email: 'email@email.com',
        password: '123321a'
      })
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('sould be able to create a user', async () => {

    const response = await request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send({
        name: 'another_name_user',
        email: 'another_email@email.com',
        password: '123321a'
      })
      .expect('Content-Type', /json/)
      .expect(200)

    const { id, name, email } = response.body

    expect(id).toBeTruthy()
    expect(name).toBe('another_name_user')
    expect(email).toBe('another_email@email.com')

  })

  it('sould be able to return 400 erro: duplicate email', async () => {

    await request(app)
      .post('/users')
      .send({
        name: 'another_name_user',
        email: 'another_email@email.com',
        password: '123321a'
      })
      .expect(400)
  })
})