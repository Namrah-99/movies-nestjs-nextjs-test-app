import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Category } from './category.entity';
import { Rating } from './rating.entity';
import { RecommendedMovie } from './recommended-movie.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@shareable')
export class Movie {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  categoryId: string;

  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field(() => [Rating], { nullable: 'itemsAndList' })
  ratings?: Rating[];

  @Field(() => [RecommendedMovie], { nullable: 'itemsAndList' })
  recommendedMovies?: RecommendedMovie[];
}
