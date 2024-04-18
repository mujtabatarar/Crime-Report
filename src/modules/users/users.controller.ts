import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoggerHandler } from 'src/helpers/logger-handler';
import { SignupDto, LoginDto, UpdateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new LoggerHandler(
    UsersController.name,
  ).getInstance();

  constructor(private usersService: UsersService) {}

  @Post('signup')
  async create(@Body() body: SignupDto) {
    this.logger.log(`HTTP::SIGNUP::create/user::recv -> ${body}`);
    return await this.usersService.create(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    this.logger.log(`HTTP::SIGNUP::create/user::recv -> ${body}`);
    return await this.usersService.login(body);
  }

  @Get('get/twenty_four_hour')
  async findWithinLast24Hours() {
    this.logger.log(
      `HTTP :: findWithinLast24Hours :: user/get/twenty_four_hour `,
    );
    return await this.usersService.findWithinLast24Hours();
  }

  @Get('get/last_week')
  async findWithinLastWeek() {
    this.logger.log(`HTTP :: findWithinLastWeek :: user/get/last_week `);
    return await this.usersService.findWithinLastWeek();
  }

  @Get('get/all')
  async findAll(@Body() body: LoginDto) {
    this.logger.log(`HTTP :: findAll:: user/get/all ::recv -> ${body}`);
    return await this.usersService.findAll();
  }
}
