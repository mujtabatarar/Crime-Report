import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Crime } from './schema/crime.schema';
import { Model } from 'mongoose';
import { LoggerHandler } from 'src/helpers/logger-handler';
import {
  ResponseData,
  ResponseHandlerInterface,
} from 'src/helpers/responseHandler';
import { errorMessage } from 'src/constants/error-message-constant';
import { CreateCrimeDto, FindByIdDto } from './dto/crime.dto';

@Injectable()
export class crimeService {
  private readonly logger = new LoggerHandler(crimeService.name).getInstance();

  constructor(@InjectModel(Crime.name) private crimeModel: Model<Crime>) {}

  async create(param: any): Promise<ResponseHandlerInterface> {
    try {
      const createdcrime = new this.crimeModel(param);
      const savedData = await createdcrime.save();
      return ResponseData.success(savedData);
    } catch (err) {
      this.logger.error(`create -> error: ${JSON.stringify(err.message)}`);
      return ResponseData.error(
        HttpStatus.BAD_REQUEST,
        err?.message || errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  async findAllLatLng(): Promise<ResponseHandlerInterface> {
    try {
      const crimes = await this.crimeModel.find({}, { lat: 1, lng: 1 }).exec();
      return ResponseData.success(crimes);
    } catch (err) {
      this.logger.error(
        `findAllLatLng -> error: ${JSON.stringify(err.message)}`,
      );
      return ResponseData.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  async getCrimeTypeCounts(): Promise<ResponseHandlerInterface> {
    try {
      const crimeTypeCounts = await this.crimeModel.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $project: { _id: 0, crimeType: '$_id', count: 1 } },
      ]);

      const crimeTypesWithCounts = crimeTypeCounts.reduce(
        (acc, { crimeType, count }) => {
          acc[crimeType] = count;
          return acc;
        },
        {},
      );

      return ResponseData.success(crimeTypesWithCounts);
    } catch (err) {
      this.logger.error(
        `getCrimeTypeCounts -> error: ${JSON.stringify(err.message)}`,
      );
      return ResponseData.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  //not using this.
  async findById(param: FindByIdDto): Promise<ResponseHandlerInterface> {
    try {
      const crime = await this.crimeModel.findById(param.id).exec();
      if (!crime) {
        return ResponseData.error(
          HttpStatus.NOT_FOUND,
          errorMessage.CRIME_NOT_FOUND,
        );
      }
      return ResponseData.success(crime);
    } catch (err) {
      this.logger.error(`findById -> error: ${JSON.stringify(err.message)}`);
      return ResponseData.error(
        HttpStatus.BAD_REQUEST,
        err?.message || errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  async getUserEngagementOverTime(): Promise<ResponseHandlerInterface> {
    try {
      const engagementData = await this.crimeModel.aggregate([
        {
          $group: {
            _id: {
              createdBy: '$createdBy',
              createdAt: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            user: '$_id.createdBy',
            date: '$_id.createdAt',
            count: '$count',
          },
        },
      ]);

      return ResponseData.success(engagementData);
    } catch (err) {
      this.logger.error(
        `getUserEngagementOverTime -> error: ${JSON.stringify(err.message)}`,
      );
      return ResponseData.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  async getParticularUserEngagementOverTime(
    userId: any,
  ): Promise<ResponseHandlerInterface> {
    console.log(userId);
    try {
      const engagementData = await this.crimeModel.aggregate([
        {
          $match: { createdBy: userId.id },
        },
        {
          $group: {
            _id: {
              createdBy: '$createdBy',
              createdAt: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            user: '$_id.createdBy',
            date: '$_id.createdAt',
            count: '$count',
          },
        },
      ]);

      return ResponseData.success(engagementData);
    } catch (err) {
      this.logger.error(
        `getUserEngagementOverTime -> error: ${JSON.stringify(err.message)}`,
      );
      return ResponseData.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }
}
