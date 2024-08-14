import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';
import { TweetsRepository } from './tweets.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet])],
  controllers: [TweetsController],
  providers: [TweetsService, TweetsRepository, Logger],
  exports: [TweetsService],
})
export class TweetsModule {}
