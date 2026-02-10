import { Injectable, Logger } from "@nestjs/common";
import { EventBus, IEvent } from "@nestjs/cqrs";
import { EventStoreService } from "./eventStore.service";
import { IStoredEventData } from "@/common/helpers/types";

@Injectable()
export class EventBusWithStore {
  private readonly logger = new Logger(EventBusWithStore.name);

  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStoreService
  ) {}

  /**
   * Publica un evento y lo guarda en el historial de eventos
   * @param event Evento de CQRS
   * @param eventData Datos específicos para guardar en la auditoría
   */
  async publish(event: IEvent, eventData: IStoredEventData): Promise<void> {
    try {
      if (!event) throw new Error("El evento está indefinido o es nulo.");

      // Guarda el evento en el historial
      await this.eventStore.save(eventData);

      // Publica el evento en el EventBus
      await this.eventBus.publish(event);

      this.logger.log(
        `✅ Evento publicado: ${event.constructor.name} - ${eventData.entityType}(${eventData.entityId}) - ${eventData.action}`
      );
    } catch (error) {
      this.logger.error(
        `❌ Error al publicar el evento ${event?.constructor?.name || "unknown"}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Publica múltiples eventos y los guarda en el historial
   */
  async publishAll(events: IEvent[], eventsData: IStoredEventData[]): Promise<void> {
    try {
      if (events.length === 0) return;

      if (events.length !== eventsData.length) {
        throw new Error("La cantidad de eventos no coincide con la de datos de auditoría");
      }

      // Guarda todos los eventos en el historial
      await this.eventStore.saveMany(eventsData);

      // Publica todos los eventos en el EventBus
      this.eventBus.publishAll(events);

      this.logger.log(`✅ ${events.length} eventos publicados.`);
    } catch (error) {
      this.logger.error(`❌ Error al publicar múltiples eventos:`, error);
      throw error;
    }
  }

  /**
   * Publica un evento sin guardar historial (eventos internos)
   */
  async publishWithoutStore(event: IEvent): Promise<void> {
    try {
      if (!event) throw new Error("El evento está indefinido o es nulo.");

      this.eventBus.publish(event);
      this.logger.debug(`📤 Evento publicado (sin historial): ${event.constructor.name}`);
    } catch (error) {
      this.logger.error(`❌ Error al publicar evento sin historial:`, error);
      throw error;
    }
  }
}
