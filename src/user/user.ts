import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
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
