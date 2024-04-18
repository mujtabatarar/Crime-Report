import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { errorMessage } from 'src/constants/error-message-constant';
import { LoggerHandler } from 'src/helpers/logger-handler';
import {
  ResponseData,
  ResponseHandlerInterface,
} from 'src/helpers/responseHandler';

import { Users } from './schemas/users.schema';
import { LoginDto, SignupDto, UpdateUserDto } from './dto/users.dto';
import { JwtService } from '@nestjs/jwt';
// import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new LoggerHandler(UsersService.name).getInstance();
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    private jwtService: JwtService,
  ) {}

  async create(data: SignupDto): Promise<ResponseHandlerInterface> {
    try {
      const createdUser = new this.usersModel(data);
      await createdUser.save();
      return ResponseData.success(createdUser);
    } catch (err) {
      this.logger.error(`create -> error: ${JSON.stringify(err)}`);
      return ResponseData.error(
        HttpStatus.BAD_REQUEST,
        err?.message || errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  // async signup(data: SignupDto) {
  //   try {
  //     // Check if the user already exists
  //     const existingUser = await this.usersModel.findOne({ data.email }).exec();
  //     if (existingUser) {
  //       return ResponseData.error(
  //         HttpStatus.CONFLICT,
  //         errorMessage.USER_ALREADY_EXISTS,
  //       );
  //     }

  //     // Hash the password
  //     const salt = await bcrypt.genSalt(10);
  //     const hashedPassword = await bcrypt.hash(password, salt);

  //     // Create a new user
  //     const newUser = new this.usersModel({
  //       name,
  //       email,
  //       password: hashedPassword,
  //     });

  //     // Save the new user to the database
  //     await newUser.save();

  //     // Generate a JWT token for the new user
  //     const token = this.jwtService.sign({ userId: newUser._id });

  //     // Return the user data and the token
  //     return ResponseData.success({
  //       user: {
  //         id: newUser._id,
  //         name: newUser.name,
  //         email: newUser.email,
  //       },
  //       token,
  //     });
  //   } catch (err) {
  //     this.logger.error(`signup -> error: ${JSON.stringify(err.message)}`);
  //     return ResponseData.error(
  //       HttpStatus.BAD_REQUEST,
  //       err?.message || errorMessage.SOMETHING_WENT_WRONG,
  //     );
  //   }
  // }

  async login(data: LoginDto): Promise<ResponseHandlerInterface> {
    try {
      const user = await this.usersModel.findOne({ email: data.email }).exec();
      if (!user) {
        return ResponseData.error(
          HttpStatus.NOT_FOUND,
          errorMessage.USER_NOT_FOUND,
        );
      }

      let isPasswordValid = false;
      if (user.password === data.password) {
        isPasswordValid = true;
      }

      if (!isPasswordValid) {
        return ResponseData.error(
          HttpStatus.UNAUTHORIZED,
          errorMessage.INVALID_CREDENTIALS,
        );
      }

      // Generate a JWT token for the user
      // const token = this.jwtService.sign({ userId: user._id });
      const token = await this.jwtService.signAsync({ userId: user._id });
      // Return the user data and the token
      return ResponseData.success({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (err) {
      this.logger.error(`create -> error: ${JSON.stringify(err)}`);
      return ResponseData.error(
        HttpStatus.BAD_REQUEST,
        err?.message || errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<ResponseData> {
    try {
      const params: any = data;
      const existingUser = await this.usersModel
        .findByIdAndUpdate({ _id: id }, params)
        .exec();

      if (!existingUser) {
        return ResponseData.error(
          HttpStatus.NOT_FOUND,
          errorMessage.USER_NOT_FOUND,
        );
      }
      return ResponseData.success(existingUser);
    } catch (err) {
      this.logger.error(`update -> error: ${JSON.stringify(err.message)}`);
      return ResponseData.error(
        HttpStatus.BAD_REQUEST,
        err?.message || errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  async findWithinLast24Hours() {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const users = await this.usersModel
        .find({ createdAt: { $gte: twentyFourHoursAgo } })
        .exec();
      return ResponseData.success(users);
    } catch (err) {
      this.logger.error(
        `findWithinLast24Hours -> error: ${JSON.stringify(err.message)}`,
      );
      return ResponseData.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  async findWithinLastWeek() {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const users = await this.usersModel
        .find({ createdAt: { $gte: oneWeekAgo } })
        .exec();
      return ResponseData.success(users);
    } catch (err) {
      this.logger.error(
        `findWithinLastWeek -> error: ${JSON.stringify(err.message)}`,
      );
      return ResponseData.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  async findAll() {
    try {
      const users = await this.usersModel.find().exec();
      return ResponseData.success(users);
    } catch (err) {
      this.logger.error(`findAll -> error: ${JSON.stringify(err.message)}`);
      return ResponseData.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  async findById(id: string) {
    try {
      const userDetail = await this.usersModel.findById({ _id: id }).exec();

      if (!userDetail) {
        return ResponseData.error(
          HttpStatus.NOT_FOUND,
          errorMessage.USER_NOT_FOUND,
        );
      }
      return ResponseData.success(userDetail);
    } catch (err) {
      this.logger.error(`findById -> error: ${JSON.stringify(err.message)}`);
      return ResponseData.error(
        HttpStatus.BAD_REQUEST,
        err?.message || errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }

  async findByIds(ids: string[]): Promise<ResponseData> {
    try {
      const userDetails = await this.usersModel
        .find({ _id: { $in: ids } })
        .select(['name', 'email'])
        .exec();
      return ResponseData.success(userDetails);
    } catch (err) {
      this.logger.error(`findByIds -> error: ${JSON.stringify(err.message)}`);
      return ResponseData.error(
        HttpStatus.BAD_REQUEST,
        err?.message || errorMessage.SOMETHING_WENT_WRONG,
      );
    }
  }
}
