import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../role/role';
import { Tweet } from '../tweet/tweet';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users, {
    createForeignKeyConstraints: false,
  })
  role: Role;

  @OneToMany(() => Tweet, (post) => post.user)
  tweets: Tweet[];

  @ManyToMany(() => User, (user) => user.follow)
  @JoinTable({
    name: 'relations',
    joinColumn: { name: 'follow_id' },
    inverseJoinColumn: { name: 'follower_id' },
  })
  follow: User[];

  @ManyToMany(() => User, (user) => user.follower)
  @JoinTable({
    name: 'relations',
    joinColumn: { name: 'follower_id' },
    inverseJoinColumn: { name: 'follow_id' },
  })
  follower: User[];

  @ManyToMany(() => Tweet, (tweet) => tweet.likedUsers)
  @JoinTable({
    name: 'likes',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'tweet_id' },
  })
  likedTweets: Tweet[];

  UserIgnoreSensitive(): UserIgnoreSensitive {
    return new UserIgnoreSensitive(this);
  }
}

export class UserIgnoreSensitive {
  id: string;
  name: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
  }
}
