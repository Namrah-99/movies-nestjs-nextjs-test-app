import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { adminResolver } from './admin.resolver';
import { PrismaService } from '../../../prisma/Prisma.service';

import { User } from 'apps/shared/entities/user.entity';
import { Avatars } from 'apps/shared/entities/avatars.entity';
import { Category } from 'apps/shared/entities/category.entity';
import { Rating } from 'apps/shared/entities/rating.entity';
import { RecommendedMovie } from 'apps/shared/entities/recommended-movie.entity';
import { Movie } from 'apps/shared/entities/movie.entity';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  controllers: [],
  providers: [
    PrismaService,
    adminResolver,
    AdminService,
    User,
    Avatars,
    Category,
    Rating,
    RecommendedMovie,
    Movie,
  ],
})
export class AdminModule {}
