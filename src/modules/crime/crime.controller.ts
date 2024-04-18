import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { crimeService } from './crime.service';
import { CreateCrimeDto } from './dto/crime.dto';
import { LoggerHandler } from 'src/helpers/logger-handler';

@Controller('crime')
export class crimeController {
  private readonly logger = new LoggerHandler(
    crimeController.name,
  ).getInstance();
  constructor(private readonly crimesService: crimeService) {}

  @Post('report')
  report(@Body() body: CreateCrimeDto, @Req() req: Request) {
    this.logger.log(
      `HTTP :: report a crime :: crime/report :: recv -> ${body}`,
    );
    const userId = req['userId'];
    return this.crimesService.create({ ...body, createdBy: userId });
  }

  @Get('get/all/locations')
  getAllCrimeLocations() {
    this.logger.log(`HTTP :: getAllCrimeLocations :: crime/all/locations`);
    return this.crimesService.findAllLatLng();
  }

  @Get('type/count')
  getCrimeTypeCounts() {
    this.logger.log(`HTTP :: getCrimeTypeCounts :: crime/type/count`);
    return this.crimesService.getCrimeTypeCounts();
  }

  @Get('user/engagement')
  getUserEngagementOverTime() {
    this.logger.log(`HTTP :: getUserEngagementOverTime :: 'user/engagement'`);
    return this.crimesService.getUserEngagementOverTime();
  }

  @Get('particular/user/engagement/:id')
  getParticularUserEngagementOverTime(@Param() id: string) {
    this.logger.log(`HTTP :: getUserEngagementOverTime :: 'user/engagement'`);
    console.log('-------------------------gggggggggggg---------------');
    return this.crimesService.getParticularUserEngagementOverTime(id);
  }
}