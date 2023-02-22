import { User } from "./User";

export class Application {
    id!: string;
    userId!: string;
    applicationStatus!: string;
    createdAt!: Date;
    updatedAt!: Date;
    jobId!: number;
    user!: User;
    application!: string;
}