import { Directive, Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Avatars {
  @Field()
  id: string;

  @Field()
  public_id: string;

  @Field()
  url: string;

  @Field()
  userId: string;
}

@ObjectType()
@Directive('@key(fields:"id")')
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone_number: number;

  @Field({ nullable: true })
  address?: string;

  @Field()
  password: string;

  @Field(() => Avatars, { nullable: true })
  avatar?: Avatars | null;

  @Field()
  role: string;

  @Field()
  image?: string;

  @Field()
  dob?: Date;

  @Field(() => [Category])
  categories?: Category[];

  @Field(() => [Rating])
  ratings?: Rating[];

  @Field(() => [RecommendedMovie])
  recommendedMovies?: RecommendedMovie[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
@Directive('@key(fields:"id")')
export class Category {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [User])
  users?: User[];

  @Field(() => [Movie])
  movies?: Movie[];
}

@ObjectType()
@Directive('@key(fields:"id")')
export class Movie {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  categoryId: string;

  @Field(() => Category)
  category?: Category;

  @Field(() => [Rating])
  ratings?: Rating[];

  @Field(() => [RecommendedMovie])
  recommendedMovies?: RecommendedMovie[];
}

@ObjectType()
export class Rating {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  movieId: string;

  @Field(() => Float)
  value: number;

  @Field(() => User)
  user?: User;

  @Field(() => Movie)
  movie?: Movie;
}

@ObjectType()
@Directive('@key(fields:"id")')
export class RecommendedMovie {
  @Field()
  id: string;

  @Field()
  movieId: string;

  @Field()
  userId: string;

  @Field(() => User)
  user?: User;

  @Field(() => Movie)
  movie?: Movie;
}
