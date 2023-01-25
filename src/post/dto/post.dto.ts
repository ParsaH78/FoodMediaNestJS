/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { IsString } from 'class-validator';

export class RateDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  rate: number;
}

export class IngredientsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

c
  amount: string;
}

export class PostDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  explain?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  desc: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => IngredientsDto)
  ingredients: IngredientsDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  category: string[];

  @IsNumber()
  @IsNotEmpty()
  readytime: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  images: string[];

  @IsString()
  @IsOptional()
  vegan?: string;

  @IsNumber()
  @IsOptional()
  people?: number;
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  explain?: string;

  @IsArray()
  @IsOptional()
  desc?: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IngredientsDto)
  ingredients?: IngredientsDto[];

  @IsArray()
  @IsOptional()
  category?: string[];

  @IsNumber()
  @IsOptional()
  readytime?: number;

  @IsString()
  @IsOptional()
  vegan?: string;

  @IsNumber()
  @IsOptional()
  people?: number;
}
