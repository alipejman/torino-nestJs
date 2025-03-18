import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { ConfirmPassengerDto, CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FormType } from 'src/common/enums/form-type.enum';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { RolesGuard } from '../auth/rbac/services/roles.guard';
import { Roles } from '../auth/rbac/decorators/role.decorator';

@Controller('reserve')
@ApiTags("Reservation")
@ApiBearerAuth("Authorization")
@Roles("user")
@UseGuards(RolesGuard)
@UserAuth()
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Post("create-reservation")
  @ApiConsumes(FormType.UrlEncoded)
  create(@Body() createReserveDto: CreateReserveDto) {
    return this.reserveService.create(createReserveDto);
  }

  @Delete("cancel-reservation/:id")
  cancel(@Param("id", ParseIntPipe) reservedId: number) {
    return this.reserveService.cancel(+reservedId)
  }

  @Post("confirm-reservation/:reserveId")
  @ApiConsumes(FormType.UrlEncoded)
  confirm(@Param("reserveId", ParseIntPipe) reserveId: number,@Body() confirmPassengerDto: ConfirmPassengerDto) {
    return this.reserveService.confirm(reserveId ,confirmPassengerDto);
  }
}