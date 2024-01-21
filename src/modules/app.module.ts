import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as process from 'process'
import { configValidationSchema } from '../config/schema.config'
import { DatabaseModule } from './database/database.module'
import { LoggerMiddleware } from '../middleware/logger.middleware'
import {UsersModule} from "./users/users.module";
import {AuthModule} from "./auth/auth.module";
import {RolesModule} from "./roles/roles.module";
import {PermissionsModule} from "./permissions/permissions.module";
import {APP_GUARD} from "@nestjs/core";
import {PermissionsGuard} from "./permissions/guards/permission.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
      UsersModule,
      AuthModule,
      RolesModule,
      PermissionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    }
  ],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
