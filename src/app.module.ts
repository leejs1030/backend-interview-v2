import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ProductModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
