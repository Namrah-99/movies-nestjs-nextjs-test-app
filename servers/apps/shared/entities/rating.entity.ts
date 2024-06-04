import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import { Movie } from './movie.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@shareable')
export class Rating {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  movieId: string;

  @Field()
  value: number;

  @Field(() => User)
  user?: User;

  @Field(() => Movie)
  movie?: Movie;
}
