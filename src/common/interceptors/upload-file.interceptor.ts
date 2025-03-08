import { FileInterceptor } from "@nestjs/platform-express"
import { memoryStorage } from "multer"

export function uploadFileS3(filedName: string) {
    return class uploadUtility extends FileInterceptor(filedName, {
        storage: memoryStorage(),
    }) {};
}