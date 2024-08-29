import { Module } from '@nestjs/common';
import { SchedulerService } from './services/scheduler.service';
import { TokenBlackListModule } from '../tokenBlackList/tokenBlackList.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [TokenBlackListModule, CartModule],
  providers: [SchedulerService],
})
export class AppSchedulerModule {}
