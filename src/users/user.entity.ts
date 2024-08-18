import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from '../config/base.entity';
import { Column, Entity } from 'typeorm';
import { PaginateConfig } from 'nestjs-paginate';
import { ROLES } from 'src/constants';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: 0 })
  followers?: number;

  @Column({ default: 0 })
  following?: number;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @Column()
  avatarUrl?: string;
}

export const USER_PAGINATE_CONFIG: PaginateConfig<User> = {
  sortableColumns: [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'username',
    'email',
    'phoneNumber',
    'role',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'username',
    'email',
    'phoneNumber',
    'role',
  ],
};
