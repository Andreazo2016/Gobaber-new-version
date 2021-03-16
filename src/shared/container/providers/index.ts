import { container } from 'tsyringe'


import IStorageProvider from './storageProvider/models/IStorageProvider'
import DiskStorageProvider from './storageProvider/implementation/DiskStorageProvider'


import IMailProvider from './mailProvider/models/IMailProvider'
import EtherealMailProvider from './mailProvider/implementations/EtherealMailProvider'


import IMailTemplateProvider from './mailTemplateProvider/models/IMailTemplateProvider'
import HandlebarsMailTemplateProvider from './mailTemplateProvider/implementation/HandlebarsMailTemplateProvider'


import ICacheProvider from './cacheProvider/models/ICacheProvider'
import RedisCacheProvider from './cacheProvider/implementations/RedisCacheProvider'

const providers = {
    disk: DiskStorageProvider,
    redis: RedisCacheProvider,
    mailTemplate: HandlebarsMailTemplateProvider,
    mailProvider: container.resolve(EtherealMailProvider)
}


/*Cria uma instância como singleton*/
container.registerSingleton<ICacheProvider>(
    'CacheProvider',
    providers.redis
)




/*Cria uma instância como singleton*/
container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    providers.disk
)



/*Cria uma instância como singleton*/
container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    providers.mailTemplate
)

/*
Cria uma instância normal
*/

container.registerInstance<IMailProvider>(
    'MailProvider',
    providers.mailProvider
)
