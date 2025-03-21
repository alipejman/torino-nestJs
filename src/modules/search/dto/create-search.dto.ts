import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SearchDto {
    @ApiPropertyOptional()
    origin: string;
    @ApiPropertyOptional()
    destination: string;
    @ApiPropertyOptional()
    start_date: Date

}
