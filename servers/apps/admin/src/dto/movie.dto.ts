import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateMovieDto {
  @Field()
  @IsNotEmpty({ message: 'Movie Title is required' })
  @IsString({ message: 'Movie Title must be a string' })
  title: string;
}
