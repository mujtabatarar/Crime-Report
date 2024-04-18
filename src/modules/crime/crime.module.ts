import { Module } from '@nestjs/common';
import { crimeService } from './crime.service';
import { crimeController } from './crime.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Crime, crimeSchema } from './schema/crime.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Crime.name, schema: crimeSchema }]),
  ],
  controllers: [crimeController],
  providers: [crimeService],
  exports: [crimeService],
})
export class crimeModule {}
