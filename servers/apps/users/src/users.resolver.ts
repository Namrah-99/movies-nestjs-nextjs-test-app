import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  RegisterResponse,
  ActivationResponse,
  LoginResponse,
  LogoutResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  UpdateProfileResponse,
  RecommendedMoviesResponseTest,
} from './types/user.types';
import {
  ActivationDto,
  ForgotPasswordDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from './dto/user.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { User } from 'apps/shared/entities/user.entity';
import { RecommendedMovie } from 'apps/shared/entities/recommended-movie.entity';
import { Rating } from 'apps/shared/entities/rating.entity';

@Resolver('User')
export class userResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Missing required fields');
    }

    const { activation_token } = await this.userService.register(
      registerDto,
      context.res,
    );
    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    return await this.userService.activateUser(activationDto, context.res);
  }

  @Mutation(() => LoginResponse)
  async Login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.userService.Login({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: Request }) {
    return this.userService.getLoggedInUser(context.req);
  }

  @Query(() => LogoutResponse)
  @UseGuards(AuthGuard)
  async logOutUser(@Context() context: { req: Request }) {
    return await this.userService.Logout(context.req);
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return await this.userService.forgotPassword(forgotPasswordDto);
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  @Mutation(() => UpdateProfileResponse)
  @UseGuards(AuthGuard)
  async updateProfile(
    @Args('updateProfileDto') updateProfileDto: UpdateProfileDto,
    @Context() context: { req: Request; res: Response },
  ): Promise<UpdateProfileResponse> {
    return await this.userService.updateProfile(
      updateProfileDto,
      context.req,
      context.res,
    );
  }

  @Mutation(() => [RecommendedMovie])
  async recommendedMoviesfromuser(
    @Args('userId') userId: string,
  ): Promise<RecommendedMovie[]> {
    return this.userService.getRecommendedMoviesForUser(userId);
  }

  @Mutation(() => Rating)
  async rateMovieFromUser(
    @Args('value') value: number,
    @Args('userId') userId: string,
    @Args('movieId') movieId: string,
  ): Promise<Rating> {
    if (!userId || !movieId || !value) {
      throw new BadRequestException('Missing required fields');
    }
    return await this.userService.rateMovieByUser(value, userId, movieId);
  }
}
