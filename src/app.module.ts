import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JoiValidationSchema } from './config/joi.validation';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemsModule } from './list-items/list-items.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { State } from './common/types/enums';

const GraphQLErrorCode = {
  GRAPHQL_VALIDATION_FAILED: 400,
  BAD_USER_INPUT: 400,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: JoiValidationSchema,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const states = [State.Prod, State.Stg];
        const isProdAndStg = states.includes(
          configService.getOrThrow<State>('STATE'),
        );
        return {
          //debug: false,
          playground: false,
          autoSchemaFile: isProdAndStg
            ? undefined
            : join(process.cwd(), 'src/schema.gql'),
          introspection: configService.getOrThrow<boolean>(
            'GRAPHQL_INTROSPECTION',
          ), // Generally false for production
          typePaths: isProdAndStg ? ['./**/*.gql'] : undefined,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          formatError: (error: any) => {
            console.log(error.extensions);
            const graphQLFormattedError = {
              message:
                error.extensions?.originalError?.message ||
                error.extensions?.response?.message ||
                error.message ||
                'Internal Server Error',
              statusCode:
                GraphQLErrorCode[error.extensions?.code] ||
                error.extensions?.originalError?.statusCode ||
                error.extensions?.response?.statusCode ||
                500,
              error:
                error.extensions?.originalError?.error ||
                error.extensions?.response?.error ||
                error.extensions?.code ||
                error.name,
            };
            return graphQLFormattedError;
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const states = [State.Prod, State.Stg];
        const isProdAndStg = states.includes(
          configService.getOrThrow<State>('STATE'),
        );
        return {
          type: 'postgres',
          host: configService.getOrThrow<string>('DB_HOST'),
          port: configService.getOrThrow<number>('DB_PORT'),
          database: configService.getOrThrow<string>('DB_NAME'),
          username: configService.getOrThrow<string>('DB_USERNAME'),
          password: configService.getOrThrow<string>('DB_PASSWORD'),
          autoLoadEntities: true,
          synchronize: configService.getOrThrow<boolean>('DB_SYNCHRONIZE'), // Generally false for production
          ssl: isProdAndStg,
          extra: {
            ssl: isProdAndStg ? { rejectUnauthorized: false } : null,
          },
          connectTimeoutMS: 10000,
          retryDelay: 5000,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      exclude: ['/graphql'],
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
