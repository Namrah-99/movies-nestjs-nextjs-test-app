// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { PrismaService } from '../../../../prisma/Prisma.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly prisma: PrismaService,
//     private readonly config: ConfigService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const gqlContext = GqlExecutionContext.create(context);
//     const { req } = gqlContext.getContext();
//     console.log('req headers in AuthGuard: ', req.headers);
//     // const accessToken = req.headers.accesstoken as string;
//     // const refreshToken = req.headers.refreshtoken as string;
//     const accessToken =
//       (req.headers['accesstoken'] as string) ||
//       (req.headers['accessToken'] as string);
//     const refreshToken =
//       (req.headers['refreshtoken'] as string) ||
//       (req.headers['refreshToken'] as string);
//     console.log('accessToken in AuthGuard: ', accessToken);
//     console.log('refreshToken in AuthGuard: ', refreshToken);
//     if (!accessToken || !refreshToken) {
//       throw new UnauthorizedException('Please login to access this resource!');
//     }

//     try {
//       const decoded = this.jwtService.verify(accessToken, {
//         secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
//       });

//       req.user = await this.prisma.user.findUnique({
//         where: { id: decoded.id },
//       });

//       if (decoded.exp * 1000 < Date.now()) {
//         await this.updateAccessToken(req);
//       }

//       return true;
//     } catch (err) {
//       await this.updateAccessToken(req);
//       return true;
//     }
//   }

//   private async updateAccessToken(req: any): Promise<void> {
//     try {
//       const refreshTokenData = req.headers.refreshtoken as string;
//       const decoded = this.jwtService.verify(refreshTokenData, {
//         secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
//       });

//       if (decoded.exp * 1000 < Date.now()) {
//         throw new UnauthorizedException(
//           'Please login to access this resource!',
//         );
//       }

//       const user = await this.prisma.user.findUnique({
//         where: { id: decoded.id },
//       });

//       const accessToken = this.jwtService.sign(
//         { id: user.id },
//         {
//           secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
//           expiresIn: '5m',
//         },
//       );

//       const refreshToken = this.jwtService.sign(
//         { id: user.id },
//         {
//           secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
//           expiresIn: '7d',
//         },
//       );
//       console.log('user ', user);
//       req.headers.accesstoken = accessToken;
//       req.headers.refreshtoken = refreshToken;

//       console.log('req.headers ', req.headers);
//       req.user = user;
//     } catch (error) {
//       throw new UnauthorizedException(error.message);
//     }
//   }
// }
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../prisma/Prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const headers = req.headers;

    // console.log('headers in AuthGuard:', headers);

    if (!headers) {
      throw new UnauthorizedException('Headers are missing in the request!');
    }

    const accessToken = headers['accesstoken'] || headers['accessToken'];
    const refreshToken = headers['refreshtoken'] || headers['refreshToken'];

    // console.log('accessToken in AuthGuard:', accessToken);
    // console.log('refreshToken in AuthGuard:', refreshToken);
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Please login to access this resource!');
    }

    try {
      const decoded = this.jwtService.verify(accessToken, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });

      req.user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (decoded.exp * 1000 < Date.now()) {
        await this.updateAccessToken(req);
      }

      return true;
    } catch (err) {
      await this.updateAccessToken(req);
      return true;
    }
  }

  private async updateAccessToken(req: any): Promise<void> {
    try {
      const refreshTokenData =
        (req.headers.refreshtoken as string) ||
        (req.headers['refreshToken'] as string);
      const decoded = this.jwtService.verify(refreshTokenData, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });

      if (decoded.exp * 1000 < Date.now()) {
        throw new UnauthorizedException(
          'Please login to access this resource!',
        );
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });

      const accessToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '5m',
        },
      );

      const refreshToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      );

      // console.log('user', user);

      req.headers.accesstoken = accessToken;
      req.headers.refreshtoken = refreshToken;

      // console.log('req.headers', req.headers);
      req.user = user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
