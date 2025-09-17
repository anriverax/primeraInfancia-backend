import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from "@/services/prisma/prisma.service";
import { DashboardController } from "./dashboard.controller"

// Import all command and query handlers here
import { GetSchoolCountsBySectorHandler } from './queries/handlers/get-school-counts-by-sector.handler';
import { GetSchoolCountsByZoneHandler } from './queries/handlers/get-school-counts-by-zone.handler';

// Define an array of all query handlers for easier management
export const QueryHandlers = [GetSchoolCountsBySectorHandler, GetSchoolCountsByZoneHandler];

@Module({
    imports: [CqrsModule],
    controllers: [DashboardController],
    providers: [PrismaService, ...QueryHandlers], // Provide Prisma and the query handlers
})
export class DashboardModule { }