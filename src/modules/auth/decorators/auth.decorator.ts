import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "../service/auth.guard";

export function UserAuth() {
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(AuthGuard)
    )
}