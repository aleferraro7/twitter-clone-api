import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from 'src/config/base.abstract.repository';
import { Tweet, TWEET_PAGINATE_CONFIG } from '.';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TweetsRepository extends BaseAbstractRepository<Tweet> {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetsRepository: Repository<Tweet>,
  ) {
    super(tweetsRepository, TWEET_PAGINATE_CONFIG);
  }
}
