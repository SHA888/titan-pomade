import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService | undefined;
  let moduleRef: TestingModule | undefined;

  beforeAll(async () => {
    try {
      moduleRef = await Test.createTestingModule({
        providers: [PrismaService],
      }).compile();

      service = moduleRef.get<PrismaService>(PrismaService);
      await service.onModuleInit(); // Initialize the connection
    } catch (error) {
      console.error('Error during test setup:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      if (service) {
        await service.onModuleDestroy();
      }
      if (moduleRef) {
        await moduleRef.close();
      }
    } catch (error) {
      console.error('Error during test teardown:', error);
      throw error;
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to the database', async () => {
    if (!service) {
      throw new Error('Service not initialized');
    }
    // This will throw if the connection fails
    await expect(service.$queryRaw`SELECT 1`).resolves.not.toThrow();
  });
});
