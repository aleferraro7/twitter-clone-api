import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class TweetDTO {
  @ApiProperty({
    description: 'Tweet author',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

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
