import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { catchError, lastValueFrom, map, pipe } from "rxjs";

@Injectable()
export class zarinpallService {
    constructor(
        private httpService : HttpService
    ) {}

    async sendRequest(data?: any) {
        const {amount, description, user} = data;
        const option = {
            merchant_id : process.env.ZARINPAL_MERCHANT_ID,
            amount: amount * 10,
            description,
            metadata: {
                email: user?.email ?? "example@gmail.com",
                phone: user?.phone ?? "",
            },
            callback_url: "http://localhost:8080/payment/verify"
        };
        const result = await lastValueFrom(
            this.httpService
            .post(process.env.ZARINPAL_REQUEST_URL, option, {})
            .pipe(map((res) => res.data))
            .pipe(
                catchError((err) => {
                    console.log(err);
                    throw new InternalServerErrorException("zarinpal error")
                    
                })
            )
        );
        const {authority, code} = result.data;
        if(code == 100 && authority) {
            return {
                code,
                authority,
                gatewayURL: `${process.env.ZARINPAL_GATEWAY_URL}/${authority}`
            }
        }
        throw new BadRequestException("connection failed to zarinpal")
    }





    async verify(data?:any) {
        const option = {
            authority: data.authority,
            amount: data.amount * 10,
            merchant_id: process.env.ZARINPAL_MERCHANT_ID
        };
        const result = await lastValueFrom(
            this.httpService
            .post(process.env.ZARINPAL_VERIFY_URL, option, {})
            .pipe(map((res) => res.data))
            .pipe(
                catchError((err) => {
                    console.log(err);
                    throw new InternalServerErrorException("zarinpal failed!")
                })
            )
        );
        return result;
    }
}