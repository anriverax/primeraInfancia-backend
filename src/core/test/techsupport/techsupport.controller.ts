import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";

import { PrismaService } from "@/services/prisma/prisma.service";
import { Controller, Get, UseFilters } from "@nestjs/common";
import { dataJSON } from "./data";

@Controller()
@UseFilters(HttpExceptionFilter)
export class TechSupportController {
  constructor(private prisma: PrismaService) {}
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  @Get()
  async add(): Promise<any> {
    const resultado: any[] = [];
    const getInscription = async (teacherId: number) => {
      const insId = await this.prisma.inscription.findFirst({
        where: { teacherId },
        select: { id: true }
      });

      return insId?.id;
    };

    for (const tecnico of dataJSON) {
      const { techSupportId, assignedRoleId, groupId, mentors } = tecnico;
      // 1️⃣ Insertar en técnicoAsignado
      const tecnicoAsignado = await this.prisma.techSupportAssignments.create({
        data: {
          techSupportId,
          assignedRoleId,
          groupId,
          createdBy: 2619
        }
      });

      const mentoresInsertados: any[] = [];

      // 2️⃣ Insertar mentores y sus docentes
      for (const mentor of mentors) {
        const { mentorId, teachers } = mentor;

        const mentoresData: any[] = [];
        for (const docenteId of teachers) {
          const inscriptionId = await getInscription(docenteId);
          if (inscriptionId) {
            // Solo agrega si existe inscriptionId
            mentoresData.push({
              mentorId,
              inscriptionId,
              techSupportAssignmentId: tecnicoAsignado.id,
              createdBy: 2619
            });
          }
        }
        if (mentoresData.length > 0) {
          try {
            await this.prisma.mentorAssignment.createMany({
              data: mentoresData
            });
          } catch (error) {
            console.log("error => ", error);
          }
        } else console.log(mentoresData);

        mentoresInsertados.push({ mentorId, teachers });
      }

      resultado.push({
        tecnicoAsignado,
        mentoresInsertados
      });
    }
  }

  /*
    try {
      return await this.prisma.inscription.findFirst({
        where: { teacherId: 421 },
        select: { id: true }
      });
    } catch (error) {
      throw new BadRequestException("Se ha producido un error al procesar su solicitud.");
    }*/
}
