import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailsSchema } from './emails.schema';

@Module({
  imports: [
    ClientKafka,
    MongooseModule.forRoot(
      'mongodb+srv://hafizhasnain:1122@cluster0.dwt3iz6.mongodb.net/emailKafka',
    ),
    MongooseModule.forFeature([{ name: 'Emails', schema: EmailsSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, ClientKafka],
})
export class AppModule {}
