import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetTeacherCountsByCareerQuery } from '../get-teacher-counts-by-career.query';

@QueryHandler(GetTeacherCountsByCareerQuery)
export class GetSchoolCountsByCareerHandler implements IQueryHandler<GetTeacherCountsByCareerQuery> {
    constructor(private prisma: PrismaService) { }

    //async execute(query: GetSchoolCountsByZoneQuery) {
    async execute() {

        const teachersByCareer = await this.prisma.academic.groupBy({
            by: ['career'],
            _count: {
                id: true,
            },
            where: {
                Person: {
                    PersonRole: {
                        some: {
                            typePersonId: 2,
                        },
                    },
                },
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
        });


        return teachersByCareer.map(item => ({
            career: item.career,
            count: item._count.id,
        }));
    }
}