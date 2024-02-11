import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User, UserIgnoreSensitive } from '../user/user';

@Entity('tweets')
export class Tweet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.tweets)
  user: UserIgnoreSensitive;

  @ManyToMany(() => User, (user) => user.likedTweets)
  @JoinTable({
    name: 'likes',
    joinColumn: { name: 'tweet_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  likedUsers: User[];
}
