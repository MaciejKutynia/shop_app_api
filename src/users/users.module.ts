import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
