import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/Prisma.service';
import { RecommendedMovie } from 'apps/shared/entities/recommended-movie.entity';
import { Rating } from 'apps/shared/entities/rating.entity';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  getRecommendedMovies(userId: string): Promise<RecommendedMovie[]> {
    return this.prisma.recommendedMovie.findMany({
      where: { userId },
      include: {
        user: {
          include: {
            categories: true,
            ratings: true,
            recommendedMovies: {
              include: {
                movie: true,
                user: true,
              },
            },
          },
        },
        movie: {
          include: {
            category: true,
            ratings: true,
            recommendedMovies: {
              include: {
                movie: true,
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async rateMovieByUser(
    value: number,
    userId: string,
    movieId: string,
  ): Promise<Rating> {
    const existingRating = await this.prisma.rating.findFirst({
      where: {
        userId,
        movieId,
      },
    });

    if (existingRating) {
      console.log('update rating');
      const updatedRating = await this.prisma.rating.update({
        where: { id: existingRating.id },
        data: { value },
        include: {
          user: {
            include: {
              categories: true,
              ratings: true,
              recommendedMovies: {
                include: {
                  movie: true,
                  user: true,
                },
              },
            },
          },
          movie: {
            include: {
              category: true,
              ratings: true,
              recommendedMovies: {
                include: {
                  movie: true,
                  user: true,
                },
              },
            },
          },
        },
      });

      return updatedRating;
    } else {
      console.log('new rating');
      const newRating = await this.prisma.rating.create({
        data: {
          value,
          userId,
          movieId,
        },
        include: {
          user: {
            include: {
              categories: true,
              ratings: true,
              recommendedMovies: {
                include: {
                  movie: true,
                  user: true,
                },
              },
            },
          },
          movie: {
            include: {
              category: true,
              ratings: true,
              recommendedMovies: {
                include: {
                  movie: true,
                  user: true,
                },
              },
            },
          },
        },
      });

      return newRating;
    }
  }
}
