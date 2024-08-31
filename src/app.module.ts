import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressModule } from 'src/addresses/addresses.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { StoreConfigModule as LocalConfigModule } from './storeConfig/storeConfig.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

import { AuthMiddleware } from './auth/middlewares/auth.middleware';
import { AppSchedulerModule } from './scheduler/scheduler.module';
import { TokenBlackListModule } from './tokenBlackList/tokenBlackList.module';
import { OrdersModule } from './orders/orders.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    //App modules
    AddressModule,
    AppSchedulerModule,
    AuthModule,
    CartModule,
    CategoriesModule,
    LocalConfigModule,
    OrdersModule,
    ProductsModule,
    StripeModule,
    TokenBlackListModule,
    UsersModule,
    //Tools modules
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
      autoSchemaFile: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        await ConfigModule.envVariablesLoaded;
        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('/auth/*').forRoutes('*');
  }
}
