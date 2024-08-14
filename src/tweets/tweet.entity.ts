import { PaginateConfig } from 'nestjs-paginate';
import { BaseEntity } from 'src/config/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'tweets' })
export class Tweet extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  tweetText: string;

  @Column({ default: 0 })
  numLikes?: number;

  @Column({ default: 0 })
  numRetweets?: number;

  @Column({ default: 0 })
  numComments?: number;
}

export const TWEET_PAGINATE_CONFIG: PaginateConfig<Tweet> = {
  sortableColumns: [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'userId',
    'tweetText',
    'numLikes',
    'numRetweets',
    'numComments',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'userId',
    'tweetText',
    'numLikes',
    'numRetweets',
    'numComments',
  ],
};
