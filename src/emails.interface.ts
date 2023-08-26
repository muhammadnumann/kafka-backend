import { Document } from 'mongoose';
export interface IEmails extends Document {
  jobId: string;
  totalEmails: number;
}
