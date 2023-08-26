import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import {
  Client,
  ClientKafka,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { EmailDto } from './email.dto';
import { Transport } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Emails } from './emails.schema';
import * as mongoose from 'mongoose';

@Controller()
export class AppController {
  constructor(
    @InjectModel(Emails.name)
    private emailsModel: mongoose.Model<Emails>,
    private readonly kafkaClient: ClientKafka,
  ) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'email-group',
      },
    },
  })
  private readonly client: ClientKafka;

  @Post('/sendEmails')
  async sendEmails(@Body() emailDto: EmailDto): Promise<{
    jobId: string;
    totalEmails: number;
    status: string;
    id: any;
  }> {
    const jobId = this.generateJobId();
    // await this.storeJob(jobId, emailDto.numberOfEmails);
    const emailsData = {
      jobId: jobId,
      totalEmails: emailDto.numberOfEmails,
      status: 'pending',
    };

    const newJob = await this.emailsModel.create(emailsData);

    await this.kafkaClient.emit('emailJobs', {
      jobId,
      numberOfEmails: emailDto.numberOfEmails,
    });

    return {
      jobId: newJob.jobId,
      totalEmails: newJob.totalEmails,
      status: newJob.status,
      id: newJob._id,
    };
  }

  @Get('/checkStatus/:jobId')
  async checkStatus(@Param('jobId') jobId: string): Promise<{
    jobId: string;
    totalEmails: number;
    status: string;
    id: any;
  }> {
    // const job = await this.getJob(jobId);
    const emailData = await this.emailsModel.findById(jobId);
    if (!emailData) {
      throw new NotFoundException('Job not found');
    }
    return {
      jobId: emailData.jobId,
      totalEmails: emailData.totalEmails,
      status: emailData.status,
      id: emailData._id,
    };
  }

  @MessagePattern('emailJobStatus')
  async handleJobStatusUpdate(
    @Payload() payload: { jobId: string; status: string; sentEmails: number },
  ) {
    const { jobId, status, sentEmails } = payload;
    await this.updateJobStatus(jobId, status, sentEmails);
  }

  // Your implementation for generating a unique job ID and storing/updating job details in a database
  private generateJobId(): string {
    // Implement your logic here to generate a unique job ID
    return Math.random().toString(36).substr(2, 9);
  }

  // private async storeJob(jobId: string, numberOfEmails: number): Promise<void> {
  //   // Implement your logic here to store the job details in a database (e.g., MongoDB)
  //   // this.bookModel;
  // }

  // private async getJob(jobId: string): Promise<any> {
  //   // Implement your logic here to retrieve job details from the database
  //   // Return null if the job is not found
  // }

  private async updateJobStatus(
    jobId: string,
    status: string,
    sentEmails: number,
  ): Promise<void> {
    // Implement your logic here to update the job status and sentEmails count in the database
  }
}
