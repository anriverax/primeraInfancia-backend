import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { UploadExcelCommand } from "../command/upload-excel.command";
import { ExcelDomainService } from "../../domain/services/excelDomain.service";
import { IPersonWithType, ITeacherDataWithPerson } from "../dto/group.type";
import { CompareDataService } from "../../infrastructure/compare-data.service";
import { IPersonRepository } from "@/api/auth/domain/ports/persistence/person.repository.port";
import { ITeacherRepository } from "../../domain/ports/teacher.respository.port";
import { GroupHierarchyService } from "../../services/groupHierarchy.service";

@CommandHandler(UploadExcelCommand)
export class UploadExcelHandler implements ICommandHandler<UploadExcelCommand> {
  private readonly logger = new Logger(UploadExcelHandler.name);

  constructor(
    @Inject("IPersonRepository") private personRepository: IPersonRepository,
    @Inject("ITeacherRepository") private teacherRepository: ITeacherRepository,

    private readonly excelService: ExcelDomainService,
    private readonly compareDataService: CompareDataService,
    private readonly groupHierarchyService: GroupHierarchyService
  ) {}
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(command: UploadExcelCommand): Promise<any> {
    const { excel } = command;

    this.logger.log(`
        ========================================
        INICIANDO PROCESAMIENTO DE EXCEL
        ========================================
        Archivo:      ${excel.originalname}
        Tamaño:       ${(excel.size / 1024).toFixed(2)} KB
        ========================================
      `);

    try {
      // 1. Process and structure the hierarchy
      const hierarchy = await this.excelService.processGroupHierarchy(excel.buffer);

      const allPerson = await this.personRepository.findMany<IPersonWithType>({
        where: {
          typePersonId: {
            in: [2, 4, 5, 6]
          }
        },
        select: {
          id: true,
          fullName: true,
          TypePerson: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      const allTeachers = await this.teacherRepository.findMany<ITeacherDataWithPerson>({
        select: {
          id: true,
          Person: {
            select: {
              id: true,
              fullName: true
            }
          }
        }
      });

      //2. compare Excel data with databases (for informational purposes only)
      this.compareDataService.compareDBData(hierarchy, allPerson, allTeachers);

      const stats = await this.groupHierarchyService.processHierarchy(hierarchy, 2619);
      console.log("Estadísticas del procesamiento:", stats);
      // const result = await this.excelService.filterCompareTechnical(excelData, allTechnicians);

      //  return result;
    } catch (error) {
      this.logger.error(`Error procesando Excel: ${error.message}`, error.stack);
      throw error;
    }
  }
}
