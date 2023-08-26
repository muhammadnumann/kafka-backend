import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use body-parser middleware to parse JSON data in requests
  app.use(bodyParser.json());

  app.enableCors();

  // Set up Kafka
  app.connectMicroservice({
    // name: 'EMAIL_MICROSERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'email-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
