import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, StoredEventAction } from "prisma/generated/client";
import { IStoredEventData } from "@/common/helpers/types";

@Injectable()
export class EventStoreService {
  private readonly logger = new Logger(EventStoreService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Método genérico para guardar eventos de cualquier entidad
   * @param data Datos del evento a guardar
   */
  async save(data: IStoredEventData): Promise<void> {
    try {
      const eventData: Prisma.StoredEventCreateInput = {
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        oldValues: data.oldValues || {},
        newValues: data.newValues || {},
        User: { connect: { id: data.createdBy } }
      };

      await this.prisma.storedEvent.create({ data: eventData });

      this.logger.debug(`✅ Evento guardado: ${data.entityType}(${data.entityId}) - ${data.action}`);
    } catch (error) {
      this.logger.error(`❌ Error guardando evento:`, error);
      throw error;
    }
  }

  /**
   * Guardar múltiples eventos
   */
  async saveMany(events: IStoredEventData[]): Promise<void> {
    try {
      const data = events.map((event) => ({
        entityType: event.entityType,
        entityId: event.entityId,
        action: event.action,
        oldValues: event.oldValues || {},
        newValues: event.newValues || {},
        createdBy: event.createdBy
      }));

      await this.prisma.storedEvent.createMany({ data });

      this.logger.debug(`✅ ${events.length} eventos guardados`);
    } catch (error) {
      this.logger.error(`❌ Error guardando múltiples eventos:`, error);
      throw error;
    }
  }

  /**
   * Obtener historial de cambios de una entidad
   */
  async getHistory(entityType: string, entityId: number) {
    return await this.prisma.storedEvent.findMany({
      where: { entityType, entityId },
      include: { User: { select: { id: true } } },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Obtener historial de cambios por tipo de acción
   */
  async getHistoryByAction(entityType: string, action: StoredEventAction) {
    return await this.prisma.storedEvent.findMany({
      where: { entityType, action },
      include: { User: { select: { id: true } } },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Obtener últimos eventos (auditoría general)
   */
  async getLatestEvents(limit: number = 50) {
    return await this.prisma.storedEvent.findMany({
      take: limit,
      include: { User: { select: { id: true } } },
      orderBy: { createdAt: "desc" }
    });
  }
}
