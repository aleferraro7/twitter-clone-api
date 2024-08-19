import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/config/base.service';
import { Tweet, TweetDTO, TweetsRepository } from '.';
import { Paginated } from 'nestjs-paginate';
import { ErrorManager } from 'src/utils/error.manager';
import { User } from 'src/users';

@Injectable()
export class TweetsService extends BaseService<Tweet> {
  constructor(private readonly tweetsRepository: TweetsRepository) {
    super(tweetsRepository);
  }

  public async getTweetsAndAuthor(authorId: number): Promise<Paginated<Tweet>> {
    try {
      const entities = await this.tweetsRepository.findWithRelations(authorId);
      if (!entities) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Not found',
        });
      }
      return entities;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  public async createTweet(user: User, data: TweetDTO): Promise<Tweet> {
    const tweet = await this.tweetsRepository.create({
      ...data,
      userId: user.id,
    });

    return tweet;
  }
}
