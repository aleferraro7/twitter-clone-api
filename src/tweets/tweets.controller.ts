import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Tweet,
  TWEET_PAGINATE_CONFIG,
  TweetDTO,
  TweetsService,
  UpdateTweetDTO,
} from '.';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { ErrorManager } from 'src/utils/error.manager';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { CurrentUser, PublicAccess, RolesAccess } from 'src/auth/decorators';
import { ROLES } from 'src/constants';
import { User } from 'src/users';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesAccess(ROLES.USER)
@ApiTags('TWEETS')
@Controller('tweets')
export class TweetsController {
  constructor(
    private readonly tweetsService: TweetsService,
    private readonly logger: Logger,
  ) {}

  // @Post()
  // async create(@Body() tweetDto: TweetDTO) {
  //   return this.tweetsService.create(tweetDto);
  // }

  @Post()
  async create(@CurrentUser() user: User, @Body() tweetDto: TweetDTO) {
    return this.tweetsService.create({
      ...tweetDto,
      userId: user.id,
    });
  }

  @PublicAccess()
  @Get()
  @ApiOkPaginatedResponse(Tweet, TWEET_PAGINATE_CONFIG)
  @ApiPaginationQuery(TWEET_PAGINATE_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.tweetsService.findAll(query);
  }

  @PublicAccess()
  @Get(':id')
  async findOneById(@Param('id') id: number) {
    try {
      const tweet = await this.tweetsService.findOneById(id);
      if (!tweet) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Tweet not found',
        });
      }
      return tweet;
    } catch {
      this.logger.error('Tweet not found'), TweetsController.name;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateTweet: UpdateTweetDTO) {
    return await this.tweetsService.update(id, updateTweet);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.tweetsService.deleteById(id);
  }
}
