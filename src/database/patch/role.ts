import { DataSource } from 'typeorm';
import { Role, ROLES } from '../../role/role';

export async function patchRole(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository<Role>(Role);
  for (const role of ROLES) {
    await repo.save(role);
  }
}
