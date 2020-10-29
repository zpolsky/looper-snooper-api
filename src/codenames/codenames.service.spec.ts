import { Test, TestingModule } from '@nestjs/testing';
import { CodenamesService } from './codenames.service';

describe('CodenamesService', () => {
  let service: CodenamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodenamesService],
    }).compile();

    service = module.get<CodenamesService>(CodenamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
