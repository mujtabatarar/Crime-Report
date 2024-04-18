import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { CrimeTypeEnum } from '../enum/crime.enum';

export class CreateCrimeDto {
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  age: number;

  @IsNotEmpty()
  @IsString()
  time: string; // or use IsDateString() if time is a date string

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(CrimeTypeEnum)
  type: CrimeTypeEnum;

  @IsOptional()
  @IsString()
  lat: string;

  @IsNotEmpty()
  @IsString()
  lng: string;
}

export class FindByIdDto {
  @IsString()
  readonly id: string;
}
