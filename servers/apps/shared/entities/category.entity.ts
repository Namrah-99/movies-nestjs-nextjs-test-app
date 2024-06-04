import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import { Movie } from './movie.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@shareable')
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
