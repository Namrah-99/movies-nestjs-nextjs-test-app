import { Field, ObjectType } from '@nestjs/graphql';
import { RecommendedMovie } from 'apps/shared/entities/recommended-movie.entity';
import { User } from 'apps/shared/entities/user.entity';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  activation_token: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ActivationResponse {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User | unknown;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field()
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ResetPasswordResponse {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message?: string;
}

@ObjectType()
export class UpdateProfileResponse {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class RecommendedMoviesResponse {
  @Field(() => RecommendedMovie, { nullable: true })
  recommendedMovies: RecommendedMovie | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class RecommendedMoviesResponseTest {
  @Field(() => [RecommendedMovie], { nullable: true })
  recommendedMovies: RecommendedMovie[] | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
