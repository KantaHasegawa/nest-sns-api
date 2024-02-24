import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from './role/role';
import { Tweet } from './tweet/tweet';
import { TweetModule } from './tweet/tweet.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'develop'
          ? './env/develop.env'
          : process.env.NODE_ENV === 'production'
            ? './env/production.env'
            : './env/test.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('RDS_HOSTNAME'),
        port: config.get<number>('MYSQL_PORT'),
        username: config.get<string>('MYSQL_USERNAME'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: config.get<string>('MYSQL_DATABASE'),
        entities: [User, Role, Tweet],
        synchronize: process.env.NODE_ENV === 'test' ? true : false,
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('BULL_REDIS_HOST'),
          port: config.get<number>('BULL_REDIS_PORT'),
        },
      }),
    }),
    UserModule,
    TweetModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
