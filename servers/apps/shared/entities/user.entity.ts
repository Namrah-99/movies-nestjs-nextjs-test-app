// import { Directive, Field, ObjectType } from '@nestjs/graphql';
// import { Category } from './category.entity';
// import { Rating } from './rating.entity';
// import { RecommendedMovie } from './recommended-movie.entity';
// import { Avatars } from './avatars.entity';

// @ObjectType()
// @Directive('@key(fields: "id")')
// @Directive('@shareable')
// export class User {
//   @Field()
//   id: string;

//   @Field()
//   name: string;

//   @Field()
//   email: string;

//   @Field({ nullable: true })
//   phone_number: number;

//   @Field({ nullable: true })
//   address?: string;

//   @Field()
//   password: string;

//   @Field(() => Avatars, { nullable: true })
//   avatar?: Avatars | null;

//   @Field()
//   role: string;

//   @Field({ nullable: true })
//   image?: string | null;

//   @Field()
//   dob?: Date;

//   @Field(() => [Category], { nullable: 'itemsAndList' })
//   categories?: Category[];

//   @Field(() => [Rating], { nullable: 'itemsAndList' })
//   ratings?: Rating[];

//   @Field(() => [RecommendedMovie], { nullable: 'itemsAndList' })
//   recommendedMovies?: RecommendedMovie[];

//   @Field()
//   createdAt: Date;

//   @Field()
//   updatedAt: Date;
// }
import { Directive, Field, ObjectType, ID } from '@nestjs/graphql';
import { Category } from './category.entity';
import { Rating } from './rating.entity';
import { RecommendedMovie } from './recommended-movie.entity';
import { Avatars } from './avatars.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@shareable')
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone_number?: number;

  @Field({ nullable: true })
  address?: string;

  @Field()
  password: string;

  @Field(() => Avatars, { nullable: true })
  avatar?: Avatars | null;

  @Field()
  role: string;

  @Field({ nullable: true })
  image?: string | null;

  @Field({ nullable: true })
  dob?: Date;

  @Field(() => [Category], { nullable: 'itemsAndList' })
  categories?: Category[];

  @Field(() => [Rating], { nullable: 'itemsAndList' })
  ratings?: Rating[];

  @Field(() => [RecommendedMovie], { nullable: 'itemsAndList' })
  recommendedMovies?: RecommendedMovie[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
