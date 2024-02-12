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
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('MYSQL_HOST'),
        port: 3306,
        username: config.get<string>('MYSQL_USERNAME'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: 'sns',
        entities: [User, Role, Tweet],
        logging: true,
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6380,
      },
    }),
    UserModule,
    TweetModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
