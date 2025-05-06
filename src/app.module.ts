import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config';
import { DataSourceConfig } from './config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    DataSourceConfig,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
