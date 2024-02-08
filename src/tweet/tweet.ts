import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User, UserIgnoreSensitive } from '../user/user';

@Entity('tweets')
export class Tweet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.tweets)
  user: UserIgnoreSensitive;
}
