import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TweetDTO {
  @ApiProperty({
    description: 'Tweet content',
    example: 'Hello world!',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(240)
  tweetText: string;
}

export class UpdateTweetDTO extends PartialType(TweetDTO) {}
