import { Company } from "./Company";

export class Job {
    id!: string;
    title!: string;
    description!: string;
    location!: string;
    jobType!: string;
    salary!: number;
    company!: Company;
    createdAt!: Date;
    updatedAt!: Date;
    expiresAt!: Date;
}