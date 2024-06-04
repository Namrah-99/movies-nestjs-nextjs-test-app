// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
// import { IntrospectAndCompose } from '@apollo/gateway';

// @Module({
//   imports: [
//     GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
//       driver: ApolloGatewayDriver,
//       gateway: {
//         supergraphSdl: new IntrospectAndCompose({
//           subgraphs: [],
//         }),
//       },
//     }),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'users', url: 'http://localhost:5001/graphql' },
            { name: 'recommendations', url: 'http://localhost:5002/graphql' },
          ],
        }),
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              request.http.headers.set('accesstoken', context.accesstoken);
              request.http.headers.set('refreshtoken', context.refreshtoken);
            },
          });
        },
      },
      server: {
        context: ({ req }) => ({
          accesstoken: req.headers.accesstoken,
          refreshtoken: req.headers.refreshtoken,
          headers: req.headers,
        }),
      },
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
