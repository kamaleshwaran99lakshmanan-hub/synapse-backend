import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Import TypeOrmModule
import { UsersService } from './users.service';
import { User } from './user.entity'; // 2. Import your User Entity

@Module({
  imports: [
    // 3. This line tells Nest: "This module uses the User table"
    TypeOrmModule.forFeature([User]), 
  ],
  providers: [UsersService],
  exports: [UsersService], // 4. Export it so AuthModule can use it!
})
export class UsersModule {}