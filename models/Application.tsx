import { Job } from "./Job";
import { User } from "./User";

export class Application {
    id!: string;
    userId!: string;
    applicationStatus!: string;
    createdAt!: Date;
    updatedAt!: Date;
    jobId!: number;
    job?: Job;
    user!: User;
    application!: string;
}