import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { zarinpallService } from "./zarinpal.service";

@Global()
@Module({
    imports: [
        HttpModule.register({
            maxRedirects: 5,
            timeout: 5000
        })
    ],
    providers: [zarinpallService],
    exports: [zarinpallService]
})

export class HttpApiModule {}