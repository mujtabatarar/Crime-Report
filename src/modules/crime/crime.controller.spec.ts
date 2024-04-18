import { Test, TestingModule } from '@nestjs/testing';
import { crimeController } from './crime.controller';
import { crimeService } from './crime.service';

describe('crimeController', () => {
  let controller: crimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [crimeController],
      providers: [crimeService],
    }).compile();

    controller = module.get<crimeController>(crimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
