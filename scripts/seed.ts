import { DataSource } from 'typeorm';
import { User } from '../src/user/user';
import { ROLES, Role } from '../src/role/role';
import { Tweet } from '../src/tweet/tweet';

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'sns',
    entities: [User, Role, Tweet],
    synchronize: false,
  });
  await dataSource.initialize();
  const roleRepo = dataSource.getRepository<Role>(Role);
  for (const r of ROLES) {
    const role = new Role();
    role.name = r.name;
    role.roleNumber = r.roleNumber;
    await roleRepo.save(role);
  }
}

seed()
  .then(() => {
    console.log('Seed complete');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
