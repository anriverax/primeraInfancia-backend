import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { Injectable, Logger } from "@nestjs/common";
import * as XLSX from "xlsx";
import { NameNormalizerService } from "./nameNormalizerDomain.service";
import {
  IExcelReadCompareResult,
  IExcelRow,
  IGroupHierarchy,
  IPersonWithType
} from "../../application/dto/group.type";

@Injectable()
/* eslint-disable @typescript-eslint/no-explicit-any */
export class ExcelDomainService {
  private readonly logger = new Logger(ExcelDomainService.name);

  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly nameNormalizerService: NameNormalizerService
  ) {}

  async processGroupHierarchy(buffer: Buffer): Promise<Map<string, IGroupHierarchy>> {
    try {
      // Read the Excel file from the buffer
      const workbook = XLSX.read(buffer, { type: "buffer" });
      // Get the name of the sheet
      const sheetName = workbook.SheetNames[0];
      // Convert the sheet to JSON
      const data: IExcelRow[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (data.length === 0) {
        this.errorHandlingService.requireTrue(false, "El archivo Excel está vacío.");
      }

      this.logger.log(`Procesando ${data.length} filas del Excel...`);

      this.validateColumns(data);

      const hierarchy = this.buildHierarchy(data);

      return hierarchy;
    } catch (error) {
      this.logger.error(`Error leyendo Excel: ${error.message}`);
      this.errorHandlingService.handleBusinessLogicError(
        `Error procesando el archivo Excel: ${error.message}`,
        error
      );
    }
  }

  async filterCompareTechnical(
    excelData: { [key: string]: any }[],
    technicians: IPersonWithType[]
  ): Promise<IExcelReadCompareResult> {
    const typePersonNames = [...new Set(technicians.map((tech) => tech.TypePerson.name))];

    try {
      // Filtrar solo los registros que tienen la propiedad "Docente"
      const technicalData = excelData.filter((row) => row["Docente"] && row["Docente"].trim() !== "");

      if (technicalData.length === 0) {
        this.logger.warn("No se encontraron técnicos en el archivo Excel");
        return { label: typePersonNames[0], found: "0 / 0", notFound: [] };
      }

      const uniqueTechnical = new Set(technicalData.map((row) => row["Docente"]));

      const resultTechnical = this.nameNormalizerService.matchByNormalizedKey<IPersonWithType>(
        uniqueTechnical,
        uniqueTechnical.size,
        technicians,
        (t) => t.fullName
      );

      this.logger.log(
        `Comparación completada: ${resultTechnical.found} técnicos encontrados, ${resultTechnical.notFound.length} no encontrados`
      );

      return { label: typePersonNames[0], ...resultTechnical };
    } catch (error) {
      this.logger.error(`Error comparando técnicos: ${error.message}`);
      this.errorHandlingService.handleBusinessLogicError(
        `Error comparando técnicos: ${error.message}`,
        error
      );
    }
  }

  private validateColumns(data: IExcelRow[]): void {
    const requiredColumns = [
      "idGrupo",
      "grupo",
      "tecnico",
      "formador",
      "mentor",
      "docente",
      "idDocente",
      "dui",
      "sexo",
      "telefono",
      "nip",
      "email",
      "centroEducativo",
      "codigo",
      "idCentroEducativo",
      "distrito",
      "idDistrito",
      "estado"
    ];

    const firstRow = data[0];
    const existingColumns = Object.keys(firstRow);

    const missingColumns = requiredColumns.filter((col) => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      this.errorHandlingService.requireTrue(
        false,
        `Faltan columnas requeridas: ${missingColumns.join(", ")}`
      );
    }
  }

  private buildHierarchy(rows: IExcelRow[]): Map<string, IGroupHierarchy> {
    const groups = new Map<string, IGroupHierarchy>();

    for (const row of rows) {
      const groupKey = this.nameNormalizerService.generateKey(row.grupo);
      const technicianKey = this.nameNormalizerService.generateKey(row.tecnico);
      const trainerKey = this.nameNormalizerService.generateKey(row.formador);
      const mentorKey = this.nameNormalizerService.generateKey(row.mentor);

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          groupId: row.idGrupo,
          groupName: row.grupo,
          technicians: new Map()
        });
      }
      const group = groups.get(groupKey)!;

      if (!group.technicians.has(technicianKey)) {
        group.technicians.set(technicianKey, {
          name: technicianKey,
          isNew: false,
          trainers: new Map()
        });
      }
      const technician = group.technicians.get(technicianKey)!;

      if (!technician.trainers.has(trainerKey)) {
        technician.trainers.set(trainerKey, {
          name: trainerKey,
          isNew: false,
          mentors: new Map()
        });
      }
      const trainer = technician.trainers.get(trainerKey)!;

      if (!trainer.mentors.has(mentorKey)) {
        trainer.mentors.set(mentorKey, {
          name: mentorKey,
          isNew: false,
          teachers: []
        });
      }
      const mentor = trainer.mentors.get(mentorKey)!;

      mentor.teachers.push({
        fullName: this.nameNormalizerService.generateKey(row.docente),
        dui: row.dui,
        sex: row.sexo || "",
        phoneNumber: row.telefono || "",
        nip: Number(row.nip) || 0,
        email: row.email || "",
        schoolName: row.centroEducativo || "",
        schoolCode: Number(row.codigo) || 0,
        district: row.distrito || "",
        state: row.estado || "Actualizado",
        id: Number(row.idDocente) || 0,
        schoolId: Number(row.idCentroEducativo) || 0,
        districtId: Number(row.idDistrito) || 0,
        isNew: false
      });
    }

    return groups;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
