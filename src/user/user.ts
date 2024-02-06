import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 10, unique: true })
  name: string;

  @Column()
  password: string;

  UserIgnoreSensitive(): UserIgnoreSensitive {
    return new UserIgnoreSensitive(this);
  }
}

export class UserIgnoreSensitive {
  id: number;
  name: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
  }
}
