import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user';

@Entity('tweets')
export class Tweet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({
    name: 'image_key',
    nullable: true,
  })
  imageKey: string;

  // NOTE: not column;
  imageURL?: string;

  @ManyToOne(() => User, (user) => user.tweets, {
    createForeignKeyConstraints: false,
  })
  user: User;

  @ManyToMany(() => User, (user) => user.likedTweets, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'likes',
    joinColumn: { name: 'tweet_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  likedUsers: User[];
}
