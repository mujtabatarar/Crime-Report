import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CrimeTypeEnum } from '../enum/crime.enum';

@Schema({ timestamps: true })
export class Crime extends Document {
  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: SchemaTypes.String, trim: true })
  description: string;

  @Prop({ required: true, default: CrimeTypeEnum.OTHER })
  type: CrimeTypeEnum;

  @Prop({ required: false })
  lat: string;

  @Prop({ required: false })
  lng: string;

  @Prop({ required: false })
  createdBy: string;
}

export const crimeSchema = SchemaFactory.createForClass(Crime);
