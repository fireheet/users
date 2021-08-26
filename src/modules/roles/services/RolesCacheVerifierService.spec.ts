import { Role, User } from '@fireheet/entities';
import { Test, TestingModule } from '@nestjs/testing';
import FakeCacheProvider from '../../../shared/providers/CacheProvider/fakes/FakeCacheProvider';
import RolesRepository from '../infra/typeorm/repositories/RolesRepository';
import RolesCacheProvider from '../providers/CacheProvider/implementations/RolesCacheProvider';
import FakeRolesRepository from '../repositories/fakes/FakeRolesRepository';
import ListAllRolesService from './ListAllRolesService';
import ListRoleService from './ListRoleService';
import RolesCacheVerifierService from './RolesCacheVerifierService';

let rolesCacheVerifier: RolesCacheVerifierService;
let rolesCacheProvider: RolesCacheProvider;
let rolesRepository: RolesRepository;
let roles: Role;

describe('UsersCacheVerifierService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RolesRepository,
          useValue: new FakeRolesRepository(),
        },
        {
          provide: RolesCacheProvider,
          useValue: new FakeCacheProvider(),
        },
        RolesCacheVerifierService,
        ListRoleService,
        ListAllRolesService,
      ],
    }).compile();

    rolesCacheVerifier = module.get<RolesCacheVerifierService>(
      RolesCacheVerifierService,
    );

    rolesRepository = module.get<RolesRepository>(RolesRepository);

    rolesCacheProvider = module.get<RolesCacheProvider>(RolesCacheProvider);

    roles = await rolesRepository.findByID('1');
  });

  it('should be able to list a cached role', async () => {
    const cacheGet = jest.spyOn(rolesCacheProvider, 'get');
    const cacheStore = jest.spyOn(rolesCacheProvider, 'store');

    await rolesCacheVerifier.execute(roles.id);

    expect(cacheStore).toHaveBeenCalledTimes(1);

    await rolesCacheVerifier.execute(roles.id);

    expect(cacheGet).toHaveBeenCalledTimes(2);
  });

  it('should be able to list all cached roles', async () => {
    const cacheGet = jest.spyOn(rolesCacheProvider, 'get');
    const cacheStore = jest.spyOn(rolesCacheProvider, 'storeMany');

    await rolesCacheVerifier.execute();

    expect(cacheStore).toHaveBeenCalledTimes(1);

    await rolesCacheVerifier.execute();

    expect(cacheGet).toHaveBeenCalledTimes(2);
  });
});
