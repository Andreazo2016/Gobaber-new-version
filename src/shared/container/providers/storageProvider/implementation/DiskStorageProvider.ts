import IStorageProvider from "../models/IStorageProvider";

import fs from 'fs'
import path from 'path'
import uploadConfig from '@config/upload'

class DiskStorageProvider implements IStorageProvider{
   public async savaefile(file:string):Promise<string>{
       /**
        * Muda o arquivo da pasta tmp para uploads
        * 
        */
    await fs.promises.rename(
        path.resolve(uploadConfig.tmpFolder,file),
        path.resolve(uploadConfig.uploadsFolder,file),

    )

    return file
   }
    public async deleteFile(file:string):Promise<void>{
        const filePath = path.resolve(uploadConfig.uploadsFolder,file)

        try {
            await fs.promises.stat(filePath)

        } catch (error) {
         return;   
        }

        await fs.promises.unlink(filePath)
    }
}

export default DiskStorageProvider