import { Module } from '@nestjs/common';
import { TokenBlackListService } from './services/tokenBlackList.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBlackListModel } from './entities/tokenBlackList.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([TokenBlackListModel]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  providers: [TokenBlackListService],
  exports: [TokenBlackListService],
})
export class TokenBlackListModule {}
