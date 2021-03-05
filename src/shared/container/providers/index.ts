import { container } from 'tsyringe'


import IStorageProvider from './storageProvider/models/IStorageProvider'
import DiskStorageProvider from './storageProvider/implementation/DiskStorageProvider'


import IMailProvider from './mailProvider/models/IMailProvider'
import EtherealMailProvider from './mailProvider/implementations/EtherealMailProvider'


import IMailTemplateProvider from './mailTemplateProvider/models/IMailTemplateProvider'
import HandlebarsMailTemplateProvider from './mailTemplateProvider/implementation/HandlebarsMailTemplateProvider'

/*Cria uma instância como singleton*/
container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider
)



/*Cria uma instância como singleton*/
container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    HandlebarsMailTemplateProvider
)


/*
Cria uma instância normal
*/

container.registerInstance<IMailProvider>(
    'MailProvider',
    container.resolve(EtherealMailProvider)
)
