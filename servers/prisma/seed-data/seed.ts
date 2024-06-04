import { PrismaService } from '../Prisma.service';
import {
  randFirstName,
  randLastName,
  randEmail,
  randPhoneNumber,
  randAddress,
  randPastDate,
  randNumber,
  randAvatar,
  randUuid,
} from '@ngneat/falso';
import * as bcrypt from 'bcrypt';

const recordsInDB = 10;
const prisma = new PrismaService();

function getRandomAlphabets(length: number): string {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () =>
    alphabets.charAt(Math.floor(Math.random() * alphabets.length)),
  ).join('');
}

async function clearDatabase() {
  await prisma.recommendedMovie.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.avatars.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
}

async function main() {
  const shouldClearDatabase = process.argv.includes('--clear');

  if (shouldClearDatabase) {
    console.log('Clearing the database...');
    await clearDatabase();
  } else {
    // categories
    await prisma.category.createMany({
      data: [
        { name: 'ACTION' },
        { name: 'HORROR' },
        { name: 'COMEDY' },
        { name: 'ANIMATED' },
      ],
    });

    const categories = await prisma.category.findMany();

    //  users
    const users = await Promise.all(
      Array.from({ length: recordsInDB }).map(async (_, index) => {
        const password = await bcrypt.hash('password123', 10);
        return prisma.user.create({
          data: {
            name: `${randFirstName()} ${randLastName()}`,
            email: randEmail(),
            phone_number: parseFloat(
              `${randPhoneNumber({ countryCode: 'PK' }).replace(/\D/g, '')}${index}`,
            ),
            address: randAddress().street,
            password,
            dob: randPastDate(),
            role: 'User',
            // image: `${randAvatar()}?${Math.random()}`,
            image: `https://i.pravatar.cc/100?u=gb${getRandomAlphabets(2)}`,
          },
        });
      }),
    );

    //  avatars
    await Promise.all(
      users.map((user) => {
        return prisma.avatars.create({
          data: {
            public_id: randUuid(),
            url: `https://i.pravatar.cc/100?u=gb${getRandomAlphabets(2)}`,
            userId: user.id,
          },
        });
      }),
    );

    // movies
    const movies = await Promise.all(
      Array.from({ length: recordsInDB }).map(async () => {
        const category =
          categories[randNumber({ min: 0, max: categories.length - 1 })];
        return prisma.movie.create({
          data: {
            title: `${category.name} Movie ${randNumber({ min: 1, max: 100 })}`,
            categoryId: category.id,
          },
        });
      }),
    );

    // ratings
    await Promise.all(
      users.map((user) => {
        const movie = movies[randNumber({ min: 0, max: movies.length - 1 })];
        return prisma.rating.create({
          data: {
            userId: user.id,
            movieId: movie.id,
            value: randNumber({ min: 1, max: 5 }),
          },
        });
      }),
    );

    // recommended movies
    await Promise.all(
      users.map(async (user) => {
        const recommendedMovies = new Set();
        for (let i = 0; i < Math.floor(Math.random() * 4) + 3; i++) {
          const movie = movies[randNumber({ min: 0, max: movies.length - 1 })];
          const newRecommendedMovie = await prisma.recommendedMovie.create({
            data: { userId: user.id, movieId: movie.id },
          });
          recommendedMovies.add(newRecommendedMovie);
        }
        return recommendedMovies;
      }),
    );

    console.log('Seeding completed...');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
