import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CORS } from './constants/cors';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Twitter Clone API', {
              colors: true,
              prettyPrint: true,
              processId: true,
            }),
          ),
        }),
      ],
    }),
  });

  app.use(cookieParser());
  app.use(morgan('dev'));
  app.enableCors(CORS);
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Twitter Clone API')
    .setDescription('Twitter Clone API')
    .setVersion('1.0')
    .addTag('Twitter Clone API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);

  console.log('The server is running in: http://localhost:3000/api');
  console.log('Swagger is running in: http://localhost:3000/api/docs');
}
bootstrap();
