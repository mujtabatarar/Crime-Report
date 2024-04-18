import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users, UsersSchema } from './schemas/users.schema';
import appConfig from 'config/appConfig';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    JwtModule.register({
      // global: true,
      secret: appConfig().jwtSecret,
      signOptions: { expiresIn: '60h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
