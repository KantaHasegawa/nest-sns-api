import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'role_number', unique: true })
  roleNumber: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.role, {
    createForeignKeyConstraints: false,
  })
  users: User[];
}

export const ROLES = [
  { roleNumber: 1, name: 'basic' },
  { roleNumber: 2, name: 'premium' },
];
