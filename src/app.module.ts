import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    // 1. Load the .env file globally
    ConfigModule.forRoot({ isGlobal: true }),
    
    // 2. Connect to the Docker Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        
        // 1. Tell TypeORM to use your all-in-one string from .env
        url: config.get<string>('DATABASE_URL'), 
        
        // 2. Tell TypeORM to encrypt the connection (Required for Neon!)
        ssl: true, 
        
        entities: [User],
        synchronize: true, // This creates the tables automatically in Neon
      }),
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {} 