import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { CatsModule } from './cats/cats.module';
import { AppService } from './app.service';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatController } from './cats/cat.controller';
import { logger } from './common/middleware/logger.middleware';


@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule{}

// export class AppModule implements NestModule {
  /*
      MiddlewareConsumer
      The MiddlewareConsumer is a helper class. It provides several built-in methods to manage middleware. 
  */
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .exclude(
  //       { path: 'cats', method: RequestMethod.GET },
  //       { path: 'cats', method: RequestMethod.POST },
  //       'cats/(.*)',
  //     )
  //     // .forRoutes({ path: 'cats', method: RequestMethod.GET })
  //     .forRoutes(CatController)
  // }

  // Function Middleware
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(logger)
  //     .forRoutes(CatController)
  // }

  // configure(consumer: MiddlewareConsumer) {
  //     consumer
  //     .apply(cors(),logger)
  //     .forRoutes(CatController)
  // }
// }
