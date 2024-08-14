import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/config/base.service';
import { Tweet, TweetsRepository } from '.';

@Injectable()
export class TweetsService extends BaseService<Tweet> {
  constructor(private readonly tweetsRepository: TweetsRepository) {
    super(tweetsRepository);
  }
}
