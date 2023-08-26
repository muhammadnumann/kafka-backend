import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Emails {
  @Prop()
  jobId: string;

  @Prop()
  totalEmails: number;

  @Prop()
  status: string;
}

export const EmailsSchema = SchemaFactory.createForClass(Emails);
