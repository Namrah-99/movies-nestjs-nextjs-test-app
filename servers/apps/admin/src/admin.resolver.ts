import {
  Args,
  Context,
  Directive,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { RecommendedMovie } from 'apps/shared/entities/recommended-movie.entity';
import { Rating } from 'apps/shared/entities/rating.entity';

@Resolver('Admin')
export class adminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => [RecommendedMovie])
  async recommendedMovies(@Args('userId') userId: string) {
    return this.adminService.getRecommendedMovies(userId);
  }

  @Mutation(() => Rating)
  async rateMovie(
    @Args('value') value: number,
    @Args('userId') userId: string,
    @Args('movieId') movieId: string,
  ) {
    return this.adminService.rateMovieByUser(value, userId, movieId);
  }
}
