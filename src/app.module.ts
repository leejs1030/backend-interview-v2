import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/products.module';

@Module({
  imports: [ProductModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
