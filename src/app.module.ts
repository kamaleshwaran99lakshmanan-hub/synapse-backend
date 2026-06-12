import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { PredictionModule } from './prediction/prediction.module';
import { AppController } from './app.controller'; // 👈 1. Imported
import { AppService } from './app.service';       // 👈 2. Imported

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'), 
        ssl: true, 
        entities: [User],
        synchronize: true, 
      }),
    }),
    AuthModule,
    UsersModule,
    PredictionModule,
  ],
  controllers: [AppController], 
  providers: [AppService],
})
export class AppModule {}