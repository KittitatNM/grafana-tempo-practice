import { initTelemetry } from './common/opentelemetry';
// ----- this has to come before imports! -------
initTelemetry({
  appName: process.env.OPEN_TELEMETRY_APP_NAME || 'CatsService',
  // telemetryUrl: process.env.OPEN_TELEMETRY_URL || 'http://localhost:64601/v1/traces',
  // telemetryUrl: process.env.OPEN_TELEMETRY_URL || 'http://localhost:64601/v1/traces',
  // telemetryUrl: process.env.OPEN_TELEMETRY_URL || 'http://localhost:8200',
  // telemetryUrl: 'http://localhost:4318/v1/traces',
  telemetryUrl:
    process.env.OPEN_TELEMETRY_URL || 'http://0.0.0.0:4318/v1/traces',
});
console.log('initialised telemetry');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/middleware/logger.middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger); // use middleware

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
