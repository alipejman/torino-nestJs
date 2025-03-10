import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty()
    text: string;   
    @ApiProperty()
    tourId: number;
}
export class CreateCommentBlogDto {
    @ApiProperty()
    text: string;   
    @ApiProperty()
    blogId: number;
}
