import { EmailService } from './email/email.service';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.service';
import { Query } from '@nestjs/graphql';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { TokenSender } from './utils/sendToken';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from 'apps/shared/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RecommendedMovie } from 'apps/shared/entities/recommended-movie.entity';
import { Rating } from 'apps/shared/entities/rating.entity';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
}

@Injectable()
export class UsersService {
  constructor(
    private httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // register user
  async register(registerInput: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerInput;

    const isEmailExist = await this.prisma.user.findUnique({
      where: { email },
    });
    if (isEmailExist) {
      throw new Error('Email already exist');
    }
    const isPhoneExist = await this.prisma.user.findUnique({
      where: { phone_number },
    });
    if (isPhoneExist) {
      throw new Error('Phone Number already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };
    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;
    const activation_token = activationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activation_token, response };
  }

  // create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );

    return { token, activationCode };
  }

  // activate user
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new BadRequestException('User already exist with this email!');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    return { user, response };
  }

  // login user
  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        avatar: true,
      },
    });
    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid credentials',
        },
      };
    }
  }

  // compare with hashed pwd
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // generating forgot password link
  async generateForgotPwdLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        user,
      },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );
    return forgotPasswordToken;
  }

  // forgot password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('User with provided email does not exist!');
    }
    const forgotPasswordToken = await this.generateForgotPwdLink(user);

    // console.log('forgotPasswordToken : ', forgotPasswordToken);

    const resetPasswordUrl =
      this.configService.get<string>('CLIENT_SIDE_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendMail({
      email,
      subject: 'Reset your Password!',
      template: './forgot-password',
      name: user.name,
      activationCode: resetPasswordUrl,
    });

    return { message: `Email sent to ${email}` };
  }

  // reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;

    const decoded = await this.jwtService.decode(activationToken);

    if (!decoded || decoded?.exp * 1000 < Date.now()) {
      throw new BadRequestException('Invalid token!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.update({
      where: {
        id: decoded.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { user };
  }

  // get logged in user
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.headers['refreshtoken'];
    const accessToken = req.headers['accesstoken'];

    return { user, refreshToken, accessToken };
  }

  // log out user
  async Logout(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accesstoken = null;
    return { message: 'Logged out successfully!' };
  }

  // get all user service
  @Query(() => [User])
  async getUsers() {
    return this.prisma.user.findMany({});
  }

  // update user profile
  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    req: any,
    res: Response,
  ) {
    try {
      const { name, address, image, dob, categories } = updateProfileDto;
      const userId = req.user.id;

      const data: any = {};
      if (name !== undefined) data.name = name;
      if (address !== undefined) data.address = address;
      if (image !== undefined) {
        const imgData = await this.cloudinaryService.upload(image);
        data.image = imgData.secure_url;
      }
      if (dob !== undefined) data.dob = dob;
      if (categories !== undefined)
        data.categories = {
          set: [],
          connect: categories.map((id) => ({ id })),
        };
      // console.log(
      //   'user update : ',
      //   name,
      //   address,
      //   image,
      //   dob,
      //   categories,
      //   userId,
      // );

      // uploading to cloudinary

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data,
        include: {
          categories: true,
        },
      });

      // const transformedCategories = user.categories.map((category) => ({
      //   ...category,
      //   users: [],
      //   movies: [],
      // }));

      // Fetch categories with related users and movies
      const transformedCategories = await Promise.all(
        updatedUser.categories.map(async (category) => {
          const fullCategory = await this.prisma.category.findUnique({
            where: { id: category.id },
            include: {
              users: true,
              movies: {
                include: {
                  category: true,
                  ratings: true,
                  recommendedMovies: true,
                },
              },
            },
          });

          return {
            ...category,
            users: fullCategory.users,
            movies: fullCategory.movies,
          };
        }),
      );

      return {
        user: {
          ...updatedUser,
          categories: transformedCategories,
        },
      };
    } catch (error) {
      return {
        user: null,
        error: {
          message: error.message,
        },
      };
    }
  }

  // get recommended movies from admin service
  async getRecommendedMoviesForUser(
    userId: string,
  ): Promise<RecommendedMovie[]> {
    const query = `
    mutation RecommendedMovies($userId: String!) {
      recommendedMovies(userId: $userId) {
        id
        movie {
          title
          category {
            name
          }
          ratings {
            value
          }
        }
        user {
          id
          name
          email
          image
          role
        }
      }
    }
    `;

    const response = await firstValueFrom(
      this.httpService.post('http://localhost:5002/graphql', {
        query,
        variables: { userId },
      }),
    );

    return response.data.data.recommendedMovies;
  }

  // rate movie from user service
  async rateMovieByUser(
    value: number,
    userId: string,
    movieId: string,
  ): Promise<Rating> {
    const query = `
    mutation RateMovie($value: Int!, $userId: String!, $movieId: String!) {
      rateMovie(value: $value, userId: $userId, movieId: $movieId) {
        id
        value
        user {
          id
          name
          email
          phone_number
          address
          role
          image
          dob
          createdAt
          updatedAt
        }
        movie {
          id
          title
          category {
            id
            name
          }
          ratings {
            id
            value
          }
          recommendedMovies {
            id
            userId
            movieId
          }
        }
      }
    }
  `;

    const variables = { value, userId, movieId };

    const response = await firstValueFrom(
      this.httpService.post('http://localhost:5002/graphql', {
        query,
        variables,
      }),
    );

    return response.data.data.rateMovie;
  }
}
