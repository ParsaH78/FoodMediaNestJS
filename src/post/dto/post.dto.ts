import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { IsString } from 'class-validator';

export class IngredientsDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
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
    desc: string[];

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({each: true})
    @Type(() => IngredientsDto)
    ingredients: IngredientsDto[];

    @IsNotEmpty()
    category: string[];

    @IsNumber()
    @IsNotEmpty()
    readytime: number;

    @IsNotEmpty()
    images: string[];

    @IsString()
    @IsOptional()
    vegan?: string;

    @IsNumber()
    @IsOptional()
    people?: number;

    @IsString()
    @IsNotEmpty()
    userId: string;
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
    @ValidateNested({each: true})
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