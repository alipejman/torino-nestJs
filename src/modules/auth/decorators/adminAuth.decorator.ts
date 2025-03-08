import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "../service/auth.guard";
import { AdminAuthGuard } from "../service/admin-auth.guard";

export function AdminAuth() {
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(AdminAuthGuard)
    )
}