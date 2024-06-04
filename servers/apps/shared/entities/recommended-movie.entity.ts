// import { Directive, Field, ObjectType } from '@nestjs/graphql';
// import { User } from './user.entity';
// import { Movie } from './movie.entity';

// @ObjectType()
// @Directive('@key(fields: "id")')
// @Directive('@shareable')
// export class RecommendedMovie {
//   @Field()
//   id: string;

//   @Field()
//   movieId: string;

//   @Field()
//   userId: string;

//   @Field(() => User, { nullable: true })
//   user?: User;

//   @Field(() => Movie, { nullable: true })
//   movie?: Movie;
// }
import { Directive, Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { Movie } from './movie.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@shareable')
export class RecommendedMovie {
  @Field(() => ID)
  id: string;

  @Field()
  movieId: string;

  @Field()
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Movie, { nullable: true })
  movie?: Movie;
}
