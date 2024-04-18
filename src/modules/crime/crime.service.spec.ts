import { Test, TestingModule } from '@nestjs/testing';
import { crimeService } from './crime.service';

describe('crimesService', () => {
  let service: crimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [crimeService],
    }).compile();

    service = module.get<crimeService>(crimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
