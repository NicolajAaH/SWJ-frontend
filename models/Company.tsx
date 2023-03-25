import { Job } from "./Job";

export class Company {
    id!: string;
    name!: string;
    website!: string;
    email!: string;
    phone!: number;
    createdAt!: Date;
    updatedAt!: Date;
    jobs?: Job[];
}
