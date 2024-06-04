import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/Prisma.service';
import { userResolver } from './users.resolver';
import { EmailModule } from './email/email.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from 'apps/shared/entities/user.entity';
import { Avatars } from 'apps/shared/entities/avatars.entity';
import { Category } from 'apps/shared/entities/category.entity';
import { Rating } from 'apps/shared/entities/rating.entity';
import { RecommendedMovie } from 'apps/shared/entities/recommended-movie.entity';
import { Movie } from 'apps/shared/entities/movie.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    EmailModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [
    UsersService,
    ConfigService,
    JwtService,
    PrismaService,
    userResolver,
    CloudinaryService,
    User,
    Avatars,
    Category,
    Rating,
    RecommendedMovie,
    Movie,
  ],
})
export class UsersModule {}
