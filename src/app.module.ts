import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';

require('dotenv').config();

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/users/users.module';
import { crimeModule } from './modules/crime/crime.module';
import { AuthMiddleware } from './helpers/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import appConfig from 'config/appConfig';

console.log(
  'in app module',
  `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
);

@Module({
  imports: [
    MongooseModule.forRoot(
      // `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
      process.env.DB_HOST,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    JwtModule.register({
      secret: appConfig().jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'crime-report-project',
        level: 'debug',
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
      },
    }),
    UsersModule,
    crimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('users/login', 'users/signup') // Exclude login and signup routes
      .forRoutes('*'); // Apply middleware to all routes
  }
}
