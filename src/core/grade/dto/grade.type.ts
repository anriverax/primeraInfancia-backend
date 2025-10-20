import { IPagination } from "@/common/helpers/types";
import {
    Grade
} from "@prisma/client";

export interface IGrade
    extends Pick<Grade, "id" | "email" | "score" | "createdAt" > {

}

export interface IGradesWithPagination {
    data: IGrade[];
    meta: IPagination;
}

export interface IGradeModuleSummary {
    moduleNumber: number;
    startDate: Date;
    endDate: Date;
    portfolioScore: number | null;
    checklistScore: number | null;
    weightedPortfolio: number | null;
    weightedChecklist: number | null;
    totalModuleScore: number | null;
}

export interface IGradeReport {
    email: string;
    modules: IGradeModuleSummary[];
    totalPortfolio: number;
    totalChecklist: number;
    overallScore: number;
}
